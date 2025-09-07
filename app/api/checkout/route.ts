// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Check if Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  console.log('Checkout API called');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { items, customerInfo, cartTotal } = body;

    // Validate required data
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('No items provided');
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    if (!customerInfo || !customerInfo.email) {
      console.error('Customer information missing');
      return NextResponse.json({ error: 'Customer information is required' }, { status: 400 });
    }

    console.log('Creating Stripe session for:', customerInfo.email);

    // Calculate shipping (matching your frontend logic)
    const shippingCost = cartTotal > 50 ? 0 : 4.99;

    // Helper function to extract image URL from Sanity image object
    const getImageUrl = (imageObj: any): string | undefined => {
      if (!imageObj) return undefined;
      
      // If it's already a string URL, return it
      if (typeof imageObj === 'string') return imageObj;
      
      // If it's a Sanity image object, extract the URL
      if (imageObj.asset && imageObj.asset._ref) {
        // Convert Sanity image reference to URL
        const ref = imageObj.asset._ref;
        const [_file, id, dimensionsAndFormat] = ref.split('-');
        const [dimensions, format] = dimensionsAndFormat.split('.');
        return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'}/production/${id}-${dimensions}.${format}`;
      }
      
      return undefined;
    };

    // Create line items for products
    const lineItems = items.map((item: any) => {
      const imageUrl = getImageUrl(item.image);
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name || 'Digital Card',
            description: item.size ? `Größe: ${item.size}` : undefined,
            images: imageUrl ? [imageUrl] : undefined, // Only include if we have a valid URL
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      };
    });

    // Add shipping as line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Versandkosten',
            description: 'Standardversand',
            images: [],
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    console.log('Line items:', lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      customer_email: customerInfo.email,
      billing_address_collection: 'auto',
      locale: 'de',
      metadata: {
        customerInfo: JSON.stringify({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          address: customerInfo.address,
          city: customerInfo.city,
          postalCode: customerInfo.postalCode,
          country: customerInfo.country,
          phone: customerInfo.phone || '',
          deliveryInstructions: customerInfo.deliveryInstructions || '',
          newsletter: customerInfo.newsletter || false,
          // Remove clerkId since we're not using Clerk anymore
        }),
        items: JSON.stringify(items.map((item: any) => ({
          ...item,
          // Make sure to include product ID for Sanity reference
          productId: item._id || item.productId || item.id, // Use _id from Sanity or productId or fallback to id
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        }))),
        cartTotal: cartTotal.toString(),
        shippingCost: shippingCost.toString(),
      },
      // Add custom fields for better order tracking
      custom_fields: [
        {
          key: 'order_notes',
          label: {
            type: 'custom',
            custom: 'Bestellnotizen (optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
    });

    console.log('Stripe session created:', session.id);

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Detailed error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error:', error.message);
      return NextResponse.json({ 
        error: 'Stripe error occurred',
        message: error.message,
        type: error.type
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}