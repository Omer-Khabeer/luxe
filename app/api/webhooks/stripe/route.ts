// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { emailService } from '@/lib/email-service';
import { client } from '@/lib/sanity'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await updateOrderPaymentStatus(paymentIntent.id, 'paid');
        break;
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await updateOrderPaymentStatus(failedPayment.id, 'failed');
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    // Parse metadata with error handling
    let customerInfo, items;
    
    try {
      customerInfo = JSON.parse(session.metadata?.customerInfo || '{}');
    } catch (err) {
      console.error('Failed to parse customerInfo:', err);
      customerInfo = {};
    }
    
    try {
      items = JSON.parse(session.metadata?.items || '[]');
      console.log('Parsed items:', items); // Debug log to see what we're getting
    } catch (err) {
      console.error('Failed to parse items:', err);
      items = [];
    }
    
    const cartTotal = parseFloat(session.metadata?.cartTotal || '0');
    const shippingCost = parseFloat(session.metadata?.shippingCost || '0');
    
    // Generate order number
    const orderNumber = `ORDER-${Date.now()}-${session.id.slice(-8).toUpperCase()}`;
    
    // Map products with better error handling
    const products = await mapItemsToSanityProducts(items);
    
    // Create order in Sanity
    const sanityOrderData = {
      _type: 'order',
      orderNumber,
      stripeCheckoutSessionID: session.id,
      stripeCustomerID: session.customer as string || '',
      clerkID: '',
      customerName: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim(),
      email: customerInfo.email || session.customer_email || '',
      stripePaymentIntentID: session.payment_intent as string || '',
      totalPrice: (session.amount_total || 0) / 100,
      amountDiscount: 0,
      currency: (session.currency || 'eur').toUpperCase(),
      products: products,
      shippingInfo: {
        firstName: customerInfo.firstName || '',
        lastName: customerInfo.lastName || '',
        address: customerInfo.address || '',
        city: customerInfo.city || '',
        postalCode: customerInfo.postalCode || '',
        country: customerInfo.country || 'Deutschland',
        phone: customerInfo.phone || '',
        deliveryInstructions: customerInfo.deliveryInstructions || '',
      },
      paymentStatus: session.payment_status === 'paid' ? 'paid' : 'pending',
      orderStatus: 'processing',
      emailStatus: {
        confirmationSent: false,
        notificationSent: false,
      },
      notes: '',
      customerNotes: customerInfo.deliveryInstructions || '',
    };

    const sanityOrder = await client.create(sanityOrderData);

    // Email processing (simplified to avoid errors)
    try {
      const emailOrderData = {
        orderNumber,
        customerInfo: {
          firstName: customerInfo.firstName || '',
          lastName: customerInfo.lastName || '',
          email: customerInfo.email || session.customer_email || '',
          address: customerInfo.address || '',
          city: customerInfo.city || '',
          postalCode: customerInfo.postalCode || '',
          country: customerInfo.country || 'Deutschland',
          phone: customerInfo.phone || '',
        },
        items: items.map((item: any) => ({
          name: item?.name || 'Product',
          price: item?.price || 0,
          quantity: item?.quantity || 1,
          size: item?.size || '',
        })),
        subtotal: cartTotal,
        shipping: shippingCost,
        total: (session.amount_total || 0) / 100,
        paymentStatus: session.payment_status || 'paid',
        createdAt: new Date().toISOString(),
      };

      const emailResults = await emailService.sendOrderEmails(emailOrderData);

      // Update order with email status
      await client
        .patch(sanityOrder._id)
        .set({
          emailStatus: {
            confirmationSent: emailResults.confirmation.success,
            confirmationSentAt: emailResults.confirmation.success ? new Date().toISOString() : null,
            notificationSent: emailResults.notification.success,
            notificationSentAt: emailResults.notification.success ? new Date().toISOString() : null,
          }
        })
        .commit();
    } catch (emailError) {
      console.error('Email processing failed:', emailError);
      // Continue even if email fails
    }

    console.log('Order processed successfully:', orderNumber);
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
    throw error;
  }
}

async function mapItemsToSanityProducts(items: any[]) {
  if (!Array.isArray(items)) {
    console.error('Items is not an array:', items);
    return [];
  }

  const products = [];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Safety checks
    if (!item || typeof item !== 'object') {
      console.error('Invalid item at index', i, ':', item);
      continue;
    }
    
    const productId = item.productId || item._id || item.id;
    
    if (productId) {
      try {
        const existingProduct = await client.fetch(
          `*[_type == "product" && _id == $productId][0]`,
          { productId }
        );
        
        if (existingProduct) {
          products.push({
            _type: 'object',
            _key: `product-${i}-${Date.now()}`,
            product: {
              _type: 'reference',
              _ref: productId,
            },
            quantity: item.quantity || 1,
            variant: item.size || '',
          });
        } else if (item.name && typeof item.name === 'string') {
          // Only search by name if it exists and is a string
          const productByName = await client.fetch(
            `*[_type == "product" && name match $name][0]`,
            { name: item.name }
          );
          
          if (productByName) {
            products.push({
              _type: 'object',
              _key: `product-${i}-${Date.now()}`,
              product: {
                _type: 'reference',
                _ref: productByName._id,
              },
              quantity: item.quantity || 1,
              variant: item.size || '',
            });
          }
        }
      } catch (error) {
        console.error('Error processing product at index', i, ':', error);
      }
    }
  }
  
  return products;
}

async function updateOrderPaymentStatus(paymentIntentId: string, status: 'paid' | 'failed') {
  try {
    const orders = await client.fetch(
      `*[_type == "order" && stripePaymentIntentID == $paymentIntentId]`,
      { paymentIntentId }
    );

    for (const order of orders) {
      await client
        .patch(order._id)
        .set({ 
          paymentStatus: status,
          updatedAt: new Date().toISOString()
        })
        .commit();
    }
  } catch (error) {
    console.error('Failed to update payment status:', error);
  }
}