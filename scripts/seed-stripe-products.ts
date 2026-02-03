// Seed script to create BiteBurst subscription products in Stripe
// Run this script manually: npx tsx scripts/seed-stripe-products.ts

import Stripe from 'stripe';

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  const connectorName = 'stripe';
  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';
  const targetEnvironment = isProduction ? 'production' : 'development';

  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', connectorName);
  url.searchParams.set('environment', targetEnvironment);

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X_REPLIT_TOKEN': xReplitToken
    }
  });

  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings?.settings?.secret) {
    throw new Error(`Stripe ${targetEnvironment} connection not found`);
  }

  return connectionSettings.settings.secret;
}

async function seedProducts() {
  console.log('🚀 Starting Stripe products seed...\n');

  const secretKey = await getCredentials();
  const stripe = new Stripe(secretKey);

  // Check if products already exist
  const existingProducts = await stripe.products.search({
    query: "metadata['app']:'biteburst'"
  });

  if (existingProducts.data.length > 0) {
    console.log('⚠️  BiteBurst products already exist in Stripe:');
    for (const product of existingProducts.data) {
      console.log(`   - ${product.name} (${product.id})`);
    }
    console.log('\nTo recreate, delete these products in the Stripe Dashboard first.');
    return;
  }

  // Create Individual Plan product
  console.log('Creating Individual Plan...');
  const individualProduct = await stripe.products.create({
    name: 'BiteBurst Pro - Individual',
    description: 'Full access to BiteBurst Pro features for 1 child. Ad-free experience, unlimited bursts, personalized practice, and parent progress tracking.',
    metadata: {
      app: 'biteburst',
      plan_type: 'individual',
      children_limit: '1',
    },
  });

  // Create Individual price ($4.50/month)
  const individualPrice = await stripe.prices.create({
    product: individualProduct.id,
    unit_amount: 450, // $4.50 in cents
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: {
      plan_type: 'individual',
    },
  });

  console.log(`✅ Individual Plan created:`);
  console.log(`   Product ID: ${individualProduct.id}`);
  console.log(`   Price ID: ${individualPrice.id}`);
  console.log(`   Amount: $4.50/month\n`);

  // Create Family Plan product
  console.log('Creating Family Plan...');
  const familyProduct = await stripe.products.create({
    name: 'BiteBurst Pro - Family',
    description: 'Full access to BiteBurst Pro features for 2-4 children. Ad-free experience, unlimited bursts, personalized practice, and parent progress tracking for the whole family.',
    metadata: {
      app: 'biteburst',
      plan_type: 'family',
      children_limit: '4',
    },
  });

  // Create Family price ($7.99/month)
  const familyPrice = await stripe.prices.create({
    product: familyProduct.id,
    unit_amount: 799, // $7.99 in cents
    currency: 'usd',
    recurring: { interval: 'month' },
    metadata: {
      plan_type: 'family',
    },
  });

  console.log(`✅ Family Plan created:`);
  console.log(`   Product ID: ${familyProduct.id}`);
  console.log(`   Price ID: ${familyPrice.id}`);
  console.log(`   Amount: $7.99/month\n`);

  console.log('🎉 All products created successfully!\n');
  console.log('Price IDs for your frontend:');
  console.log(`   Individual: ${individualPrice.id}`);
  console.log(`   Family: ${familyPrice.id}`);
}

seedProducts().catch(console.error);
