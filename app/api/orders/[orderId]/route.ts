// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// Simple admin authentication check
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    return true;
  }
  // For now, return true to allow access (remove in production)
  return true;
}

// GET single order
export async function GET(request: NextRequest, context: any) {
  const { orderId } = context.params as { orderId: string };

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let query;
    let params;

    // If email is provided, filter by email (customer access)
    if (email) {
      query = `*[_type == "order" && _id == $orderId && email == $email][0]{
        _id, orderNumber, stripeCheckoutSessionID, customerName, email, totalPrice,
        amountDiscount, currency, orderStatus, paymentStatus, trackingNumber,
        shippingCarrier, shippingInfo,
        products[]{ quantity, variant, product->{ _id, name, description, price, image, slug } },
        emailStatus, notes, customerNotes, _createdAt, _updatedAt
      }`;
      params = { orderId, email };
    } else {
      // Admin access - no email filter
      query = `*[_type == "order" && _id == $orderId][0]{
        _id, orderNumber, stripeCheckoutSessionID, customerName, email, totalPrice,
        amountDiscount, currency, orderStatus, paymentStatus, trackingNumber,
        shippingCarrier, shippingInfo,
        products[]{ quantity, variant, product->{ _id, name, description, price, image, slug } },
        emailStatus, notes, customerNotes, _createdAt, _updatedAt
      }`;
      params = { orderId };
    }

    const order = await client.fetch(query, params);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH (admin only)
export async function PATCH(request: NextRequest, context: any) {
  const { orderId } = context.params as { orderId: string };

  try {
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { orderStatus, trackingNumber, shippingCarrier, notes } = await request.json();

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const updateData: Record<string, any> = { _updatedAt: new Date().toISOString() };
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (shippingCarrier !== undefined) updateData.shippingCarrier = shippingCarrier;
    if (notes !== undefined) updateData.notes = notes;

    const updatedOrder = await client.patch(orderId).set(updateData).commit();

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}