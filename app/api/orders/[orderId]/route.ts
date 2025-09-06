import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '../../../../lib/sanity';

// GET single order
export async function GET(_req: NextRequest, context: any) {
  const { orderId } = context.params as { orderId: string };

  try {
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId && clerkID == $userId][0]{
        _id, orderNumber, stripeCheckoutSessionID, customerName, email, totalPrice,
        amountDiscount, currency, orderStatus, paymentStatus, trackingNumber,
        shippingCarrier, shippingInfo,
        products[]{ quantity, variant, product->{ _id, name, description, price, image, slug } },
        emailStatus, notes, customerNotes, _createdAt, _updatedAt
      }`,
      { orderId, userId }
    );

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error('Failed to fetch order:', err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH (admin)
export async function PATCH(req: NextRequest, context: any) {
  const { orderId } = context.params as { orderId: string };

  try {
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { orderStatus, trackingNumber, shippingCarrier, notes } = await req.json();

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    const updateData: Record<string, any> = { _updatedAt: new Date().toISOString() };
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (shippingCarrier) updateData.shippingCarrier = shippingCarrier;
    if (notes) updateData.notes = notes;

    const updatedOrder = await client.patch(orderId).set(updateData).commit();

    // optionally trigger email here
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Failed to update order:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
