// app/api/test-stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    const hasPublicKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY;
    
    console.log('Public key exists:', hasPublicKey);
    console.log('Secret key exists:', hasSecretKey);
    console.log('Public key (first 20 chars):', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20));
    console.log('Secret key (first 20 chars):', process.env.STRIPE_SECRET_KEY?.substring(0, 20));

    if (!hasSecretKey) {
      return NextResponse.json({ 
        error: 'STRIPE_SECRET_KEY not found in environment variables' 
      }, { status: 500 });
    }

    // Test Stripe connection
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });

    // Try to retrieve account information
    const account = await stripe.accounts.retrieve();
    
    return NextResponse.json({ 
      success: true,
      hasPublicKey,
      hasSecretKey,
      accountId: account.id,
      accountCountry: account.country,
      message: 'Stripe connection successful!'
    });

  } catch (error) {
    console.error('Stripe test error:', error);
    
    return NextResponse.json({ 
      error: 'Stripe connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      hasPublicKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY
    }, { status: 500 });
  }
}