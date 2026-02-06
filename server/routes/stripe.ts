// Stripe payment routes
import type { Express } from "express";
import { storage } from "../storage";
import { getUncachableStripeClient, getStripePublishableKey } from "../lib/stripeClient";
import { db } from "../db";
import { sql } from "drizzle-orm";

export function registerStripeRoutes(app: Express, requireAuth: any) {
  // Get Stripe publishable key (for frontend)
  app.get('/api/stripe/config', async (req: any, res: any) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error('Error getting Stripe config:', error);
      res.status(500).json({ error: 'Failed to get Stripe configuration' });
    }
  });

  // Get subscription plans (prices from Stripe)
  app.get('/api/stripe/prices', async (req: any, res: any) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          p.metadata as product_metadata,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        JOIN stripe.prices pr ON pr.product = p.id
        WHERE p.active = true AND pr.active = true
        ORDER BY pr.unit_amount ASC
      `);
      res.json({ prices: result.rows });
    } catch (error) {
      console.error('Error fetching prices:', error);
      res.status(500).json({ error: 'Failed to fetch prices' });
    }
  });

  // Create checkout session for subscription
  app.post('/api/stripe/create-checkout-session', requireAuth, async (req: any, res: any) => {
    try {
      const { priceId, childrenLimit } = req.body;
      const parentAuthId = req.userId as string;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stripe = await getUncachableStripeClient();

      // Create or get Stripe customer
      let customerId = parentUser.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: parentUser.email,
          metadata: { 
            userId: parentUser.id,
            parentAuthId: parentAuthId
          },
        });
        customerId = customer.id;
        
        // Save customer ID to user
        await storage.updateUser(parentUser.id, { stripeCustomerId: customerId } as any);
      }

      // Create checkout session
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        subscription_data: {
          trial_period_days: 7,
        },
        success_url: `${baseUrl}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/settings/subscription?canceled=true`,
        metadata: {
          userId: parentUser.id,
          childrenLimit: childrenLimit?.toString() || '1',
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  });

  // Get current subscription status
  app.get('/api/stripe/subscription', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId as string;
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!parentUser.stripeSubscriptionId) {
        return res.json({ 
          subscription: null,
          plan: parentUser.subscriptionPlan || 'free',
          childrenLimit: parentUser.subscriptionChildrenLimit || 1
        });
      }

      // Get subscription from local stripe schema
      const result = await db.execute(sql`
        SELECT * FROM stripe.subscriptions WHERE id = ${parentUser.stripeSubscriptionId}
      `);

      const subscription = result.rows[0];
      
      res.json({ 
        subscription,
        plan: parentUser.subscriptionPlan || 'free',
        childrenLimit: parentUser.subscriptionChildrenLimit || 1
      });
    } catch (error) {
      console.error('Error getting subscription:', error);
      res.status(500).json({ error: 'Failed to get subscription' });
    }
  });

  // Create customer portal session (for managing subscription)
  app.post('/api/stripe/create-portal-session', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId as string;
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      
      if (!parentUser?.stripeCustomerId) {
        return res.status(400).json({ error: 'No Stripe customer found' });
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      
      const session = await stripe.billingPortal.sessions.create({
        customer: parentUser.stripeCustomerId,
        return_url: `${baseUrl}/settings/subscription`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: error.message || 'Failed to create portal session' });
    }
  });

  // Handle successful checkout (called after redirect from Stripe)
  app.post('/api/stripe/checkout-success', requireAuth, async (req: any, res: any) => {
    try {
      const { sessionId } = req.body;
      const parentAuthId = req.userId as string;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });

      // Security: Verify session belongs to the authenticated user
      // Primary check: metadata userId MUST match current user
      // Secondary check: if user has stripeCustomerId, session customer must match
      const sessionUserId = session.metadata?.userId;
      const sessionCustomer = session.customer as string;
      
      // Require metadata userId to be present and match
      if (!sessionUserId) {
        console.error('Session missing userId metadata:', session.id);
        return res.status(400).json({ error: 'Invalid session - missing user metadata' });
      }
      
      if (sessionUserId !== parentUser.id) {
        console.error('Session userId mismatch:', { sessionUserId, parentUserId: parentUser.id });
        return res.status(403).json({ error: 'Session does not belong to this user' });
      }
      
      // If user already has a stripeCustomerId, customer must also match
      if (parentUser.stripeCustomerId && sessionCustomer !== parentUser.stripeCustomerId) {
        console.error('Session customer mismatch:', { sessionCustomer, parentCustomerId: parentUser.stripeCustomerId });
        return res.status(403).json({ error: 'Session customer does not match' });
      }

      if (session.payment_status === 'paid' && session.subscription) {
        const subscription = session.subscription as any;
        const childrenLimit = parseInt(session.metadata?.childrenLimit || '1', 10);
        
        // Determine plan type based on price
        let plan = 'individual';
        if (childrenLimit > 1) {
          plan = 'family';
        }

        // Update user subscription info
        await storage.updateSubscription(parentUser.id, plan, childrenLimit);
        await storage.updateUser(parentUser.id, { 
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: sessionCustomer
        } as any);

        res.json({ 
          success: true, 
          plan,
          childrenLimit,
          subscriptionId: subscription.id
        });
      } else {
        res.status(400).json({ error: 'Payment not completed' });
      }
    } catch (error: any) {
      console.error('Error processing checkout success:', error);
      res.status(500).json({ error: error.message || 'Failed to process checkout' });
    }
  });

  // Cancel subscription
  app.post('/api/stripe/cancel-subscription', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId as string;
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      
      if (!parentUser?.stripeSubscriptionId) {
        return res.status(400).json({ error: 'No active subscription' });
      }

      const stripe = await getUncachableStripeClient();
      
      // Cancel at period end (not immediately)
      await stripe.subscriptions.update(parentUser.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      res.json({ success: true, message: 'Subscription will be cancelled at the end of the billing period' });
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ error: error.message || 'Failed to cancel subscription' });
    }
  });
}
