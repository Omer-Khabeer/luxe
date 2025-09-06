// app/api/order-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });
    
    // Parse metadata
    const customerInfo = session.metadata?.customerInfo 
      ? JSON.parse(session.metadata.customerInfo)
      : {};
    const items = session.metadata?.items 
      ? JSON.parse(session.metadata.items)
      : [];

    return NextResponse.json({
      sessionId: session.id,
      customerEmail: session.customer_email,
      customerInfo,
      items,
      lineItems: session.line_items?.data || [],
      totalAmount: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      paymentIntentId: session.payment_intent,
      createdAt: new Date(session.created * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json({ 
      error: 'Session not found',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 404 });
  }
}