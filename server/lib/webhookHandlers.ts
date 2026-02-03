import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from '../storage';
import { db } from '../db';
import { sql } from 'drizzle-orm';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    
    // Process webhook with stripe-replit-sync to sync data
    await sync.processWebhook(payload, signature);
    
    // Also handle subscription events to update user records
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      // Log loudly but don't fail - stripe-replit-sync handles the core sync
      console.error('⚠️ WARNING: STRIPE_WEBHOOK_SECRET not configured!');
      console.error('⚠️ Custom subscription state updates will NOT be processed.');
      console.error('⚠️ Configure STRIPE_WEBHOOK_SECRET to enable full subscription handling.');
      return;
    }
    
    try {
      const stripe = await getUncachableStripeClient();
      const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      await WebhookHandlers.handleEvent(event);
    } catch (eventError: any) {
      console.error('Error constructing/handling webhook event:', eventError.message);
      // Don't throw - stripe-replit-sync already processed successfully
    }
  }

  static async handleEvent(event: any): Promise<void> {
    console.log('Processing Stripe event:', event.type);
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await WebhookHandlers.handleSubscriptionUpdate(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await WebhookHandlers.handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'checkout.session.completed':
        await WebhookHandlers.handleCheckoutCompleted(event.data.object);
        break;
        
      default:
        console.log('Unhandled event type:', event.type);
    }
  }

  static async handleSubscriptionUpdate(subscription: any): Promise<void> {
    try {
      const customerId = subscription.customer as string;
      
      // Find user by stripe customer ID
      const user = await WebhookHandlers.findUserByCustomerId(customerId);
      if (!user) {
        console.warn('No user found for customer:', customerId);
        return;
      }

      // Determine subscription status
      const isActive = ['active', 'trialing'].includes(subscription.status);
      
      if (isActive) {
        // Get plan details from subscription items
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const { plan, childrenLimit } = await WebhookHandlers.determinePlanFromPrice(priceId, subscription.metadata);
        
        await storage.updateSubscription(user.id, plan, childrenLimit);
        await storage.updateUser(user.id, { stripeSubscriptionId: subscription.id } as any);
        
        console.log(`Updated subscription for user ${user.id}: ${plan} (${childrenLimit} children)`);
      } else if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
        // Mark for cancellation but don't remove access yet
        console.log(`Subscription marked for cancellation for user ${user.id}`);
      }
    } catch (error) {
      console.error('Error handling subscription update:', error);
    }
  }

  static async handleSubscriptionDeleted(subscription: any): Promise<void> {
    try {
      const customerId = subscription.customer as string;
      
      const user = await WebhookHandlers.findUserByCustomerId(customerId);
      if (!user) {
        console.warn('No user found for customer:', customerId);
        return;
      }

      // Downgrade to free plan
      await storage.updateSubscription(user.id, 'free', 1);
      await storage.updateUser(user.id, { stripeSubscriptionId: null } as any);
      
      console.log(`Subscription cancelled for user ${user.id}, downgraded to free`);
    } catch (error) {
      console.error('Error handling subscription deletion:', error);
    }
  }

  static async handleCheckoutCompleted(session: any): Promise<void> {
    try {
      if (session.mode !== 'subscription' || !session.subscription) {
        return;
      }

      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const childrenLimit = parseInt(session.metadata?.childrenLimit || '1', 10);
      
      let user = null;
      if (userId) {
        user = await storage.getUser(userId);
      }
      if (!user && customerId) {
        user = await WebhookHandlers.findUserByCustomerId(customerId);
      }
      
      if (!user) {
        console.warn('No user found for checkout session:', session.id);
        return;
      }

      const plan = childrenLimit > 1 ? 'family' : 'individual';
      
      await storage.updateSubscription(user.id, plan, childrenLimit);
      await storage.updateUser(user.id, { 
        stripeSubscriptionId: session.subscription,
        stripeCustomerId: customerId 
      } as any);
      
      console.log(`Checkout completed for user ${user.id}: ${plan} plan`);
    } catch (error) {
      console.error('Error handling checkout completed:', error);
    }
  }

  static async findUserByCustomerId(customerId: string): Promise<any | null> {
    try {
      const result = await db.execute(sql`
        SELECT * FROM users WHERE stripe_customer_id = ${customerId} LIMIT 1
      `);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by customer ID:', error);
      return null;
    }
  }

  static async determinePlanFromPrice(priceId: string, metadata: any): Promise<{ plan: string; childrenLimit: number }> {
    try {
      // Check metadata first
      if (metadata?.childrenLimit) {
        const childrenLimit = parseInt(metadata.childrenLimit, 10);
        return {
          plan: childrenLimit > 1 ? 'family' : 'individual',
          childrenLimit
        };
      }

      // Look up price in synced Stripe data
      const result = await db.execute(sql`
        SELECT p.metadata as product_metadata
        FROM stripe.prices pr
        JOIN stripe.products p ON p.id = pr.product
        WHERE pr.id = ${priceId}
      `);

      const productMetadata = result.rows[0]?.product_metadata as any;
      if (productMetadata?.plan_type === 'family') {
        return { plan: 'family', childrenLimit: 4 };
      }
      
      return { plan: 'individual', childrenLimit: 1 };
    } catch (error) {
      console.error('Error determining plan from price:', error);
      return { plan: 'individual', childrenLimit: 1 };
    }
  }
}
