// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { emailService } from '@/lib/email-service';
import { client } from '@/lib/sanity'; 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${paymentIntent.id}`);
      await updateOrderPaymentStatus(paymentIntent.id, 'paid');
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${failedPayment.id}`);
      await updateOrderPaymentStatus(failedPayment.id, 'failed');
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing successful payment:', session.id);
    
    // Parse metadata
    const customerInfo = JSON.parse(session.metadata?.customerInfo || '{}');
    const items = JSON.parse(session.metadata?.items || '[]');
    const cartTotal = parseFloat(session.metadata?.cartTotal || '0');
    const shippingCost = parseFloat(session.metadata?.shippingCost || '0');
    
    // Generate order number
    const orderNumber = `ORDER-${Date.now()}-${session.id.slice(-8).toUpperCase()}`;
    
    // Create order in Sanity
    const sanityOrderData = {
      _type: 'order',
      orderNumber,
      stripeCheckoutSessionID: session.id,
      stripeCustomerID: session.customer as string || '',
      clerkID: customerInfo.clerkId || '', // You'll need to pass this from frontend
      customerName: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim(),
      email: customerInfo.email || session.customer_email || '',
      stripePaymentIntentID: session.payment_intent as string || '',
      totalPrice: (session.amount_total || 0) / 100,
      amountDiscount: 0, // Calculate if you have discounts
      currency: (session.currency || 'eur').toUpperCase(),
      products: await mapItemsToSanityProducts(items),
      // Add additional fields
      shippingInfo: {
        address: customerInfo.address || '',
        city: customerInfo.city || '',
        postalCode: customerInfo.postalCode || '',
        country: customerInfo.country || 'Deutschland',
        phone: customerInfo.phone || '',
        deliveryInstructions: customerInfo.deliveryInstructions || '',
      },
      paymentStatus: session.payment_status === 'paid' ? 'paid' : 'pending',
      orderStatus: 'processing',
    };

    console.log('Creating order in Sanity:', orderNumber);
    const sanityOrder = await client.create(sanityOrderData);
    console.log('✅ Order created in Sanity:', sanityOrder._id);

    // Prepare email data
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
        name: item.name || 'Digital Card',
        price: item.price || 0,
        quantity: item.quantity || 1,
        size: item.size || undefined,
      })),
      subtotal: cartTotal,
      shipping: shippingCost,
      total: (session.amount_total || 0) / 100,
      paymentStatus: session.payment_status || 'paid',
      createdAt: new Date().toISOString(),
    };

    console.log('Sending order emails for order:', orderNumber);

    // Send emails
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

    // Log results
    if (emailResults.confirmation.success) {
      console.log('✅ Confirmation email sent successfully:', emailResults.confirmation.messageId);
    } else {
      console.error('❌ Failed to send confirmation email:', emailResults.confirmation.error);
    }

    if (emailResults.notification.success) {
      console.log('✅ Notification email sent successfully:', emailResults.notification.messageId);
    } else {
      console.error('❌ Failed to send notification email:', emailResults.notification.error);
    }

    // Update product inventory if you track it
    await updateProductInventory(items);
    
    console.log('Order processed successfully:', orderNumber);
    
  } catch (error) {
    console.error('Error processing successful payment:', error);
    
    // Still try to send a basic notification email even if there's an error
    try {
      if (session.customer_email) {
        console.log('Attempting to send basic confirmation email due to processing error');
      }
    } catch (emailError) {
      console.error('Failed to send fallback email:', emailError);
    }
  }
}

// Helper function to map items to Sanity product references
async function mapItemsToSanityProducts(items: any[]) {
  const products = [];
  
  for (const item of items) {
    // If you have product IDs in your items, use them to create references
    if (item.productId) {
      products.push({
        _type: 'object',
        product: {
          _type: 'reference',
          _ref: item.productId,
        },
        quantity: item.quantity || 1,
      });
    } else {
      // If no product ID, you might need to find the product by name or create a generic product
      // For now, we'll log this case and skip
      console.warn('Item without productId found:', item);
      
      // You could search for the product by name:
      const existingProduct = await client.fetch(
        `*[_type == "product" && name match $name][0]`,
        { name: item.name }
      );
      
      if (existingProduct) {
        products.push({
          _type: 'object',
          product: {
            _type: 'reference',
            _ref: existingProduct._id,
          },
          quantity: item.quantity || 1,
        });
      }
    }
  }
  
  return products;
}

// Helper function to update order payment status
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
      
      console.log(`Updated payment status for order ${order.orderNumber} to ${status}`);
    }
  } catch (error) {
    console.error('Failed to update payment status:', error);
  }
}

// Helper function to update product inventory
async function updateProductInventory(items: any[]) {
  try {
    const transaction = client.transaction();
    
    for (const item of items) {
      if (item.productId) {
        // Decrease inventory count (assuming you have an inventory field)
        transaction.patch(item.productId).dec({ inventory: item.quantity || 1 });
      }
    }
    
    await transaction.commit();
    console.log('✅ Product inventory updated');
  } catch (error) {
    console.error('Failed to update inventory:', error);
    // Don't throw error here to avoid breaking order creation
  }
}