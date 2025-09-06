// app/api/orders/route.ts - Get user's orders
import { NextRequest, NextResponse } from 'next/server';
import { ClerkProvider } from "@clerk/nextjs";
import { client } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build query
    let query = `*[_type == "order" && clerkID == $userId`;
    const params: any = { userId };

    if (status) {
      query += ` && orderStatus == $status`;
      params.status = status;
    }

    query += `] | order(_createdAt desc)`;

    // Add pagination
    const start = (page - 1) * limit;
    query += `[${start}...${start + limit}]`;

    // Add fields to fetch
    query += ` {
      _id,
      orderNumber,
      customerName,
      email,
      totalPrice,
      currency,
      orderStatus,
      paymentStatus,
      trackingNumber,
      shippingCarrier,
      shippingInfo,
      products[] {
        quantity,
        variant,
        product-> {
          _id,
          name,
          price,
          image,
          slug
        }
      },
      emailStatus,
      _createdAt,
      _updatedAt
    }`;

    const orders = await client.fetch(query, params);

    // Get total count for pagination
    let countQuery = `count(*[_type == "order" && clerkID == $userId`;
    if (status) {
      countQuery += ` && orderStatus == $status`;
    }
    countQuery += `])`;

    const totalCount = await client.fetch(countQuery, params);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// app/api/orders/[orderId]/route.ts - Get single order
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { client } from '@/lib/sanity';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order = await client.fetch(`
      *[_type == "order" && _id == $orderId && clerkID == $userId][0] {
        _id,
        orderNumber,
        stripeCheckoutSessionID,
        customerName,
        email,
        totalPrice,
        amountDiscount,
        currency,
        orderStatus,
        paymentStatus,
        trackingNumber,
        shippingCarrier,
        shippingInfo,
        products[] {
          quantity,
          variant,
          product-> {
            _id,
            name,
            description,
            price,
            image,
            slug
          }
        },
        emailStatus,
        notes,
        customerNotes,
        _createdAt,
        _updatedAt
      }
    `, { orderId: params.orderId, userId });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH method for updating order status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (implement your admin check logic)
    const isAdmin = await checkIfUserIsAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { orderStatus, trackingNumber, shippingCarrier, notes } = body;

    // Validate status
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    // Build update object
    const updateData: any = {
      _updatedAt: new Date().toISOString(),
    };

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (shippingCarrier) updateData.shippingCarrier = shippingCarrier;
    if (notes) updateData.notes = notes;

    const updatedOrder = await client
      .patch(params.orderId)
      .set(updateData)
      .commit();

    // Send status update email to customer if status changed
    if (orderStatus) {
      await sendOrderStatusUpdateEmail(params.orderId, orderStatus);
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder 
    });

  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// Helper function to check if user is admin
async function checkIfUserIsAdmin(userId: string): Promise<boolean> {
  // Implement your admin check logic here
  // This could be checking against a list of admin user IDs,
  // checking user roles in Clerk, or checking against a Sanity admin schema
  
  const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || [];
  return adminUserIds.includes(userId);
}

// Helper function to send status update email
async function sendOrderStatusUpdateEmail(orderId: string, newStatus: string) {
  try {
    const order = await client.fetch(`
      *[_type == "order" && _id == $orderId][0] {
        orderNumber,
        customerName,
        email,
        trackingNumber,
        shippingCarrier
      }
    `, { orderId });

    if (!order) return;

    // Implement your email service logic here
    // await emailService.sendStatusUpdate({
    //   to: order.email,
    //   orderNumber: order.orderNumber,
    //   customerName: order.customerName,
    //   status: newStatus,
    //   trackingNumber: order.trackingNumber,
    //   shippingCarrier: order.shippingCarrier
    // });

    console.log(`Status update email sent for order ${order.orderNumber}: ${newStatus}`);
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
}

// app/api/orders/stats/route.ts - Order statistics for admin
export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkIfUserIsAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get order statistics
    const stats = await client.fetch(`{
      "totalOrders": count(*[_type == "order"]),
      "totalRevenue": sum(*[_type == "order" && paymentStatus == "paid"].totalPrice),
      "ordersByStatus": {
        "processing": count(*[_type == "order" && orderStatus == "processing"]),
        "shipped": count(*[_type == "order" && orderStatus == "shipped"]),
        "delivered": count(*[_type == "order" && orderStatus == "delivered"]),
        "cancelled": count(*[_type == "order" && orderStatus == "cancelled"]),
        "refunded": count(*[_type == "order" && orderStatus == "refunded"])
      },
      "paymentsByStatus": {
        "paid": count(*[_type == "order" && paymentStatus == "paid"]),
        "pending": count(*[_type == "order" && paymentStatus == "pending"]),
        "failed": count(*[_type == "order" && paymentStatus == "failed"]),
        "refunded": count(*[_type == "order" && paymentStatus == "refunded"])
      },
      "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5] {
        _id,
        orderNumber,
        customerName,
        totalPrice,
        currency,
        orderStatus,
        _createdAt
      },
      "topProducts": *[_type == "product"] {
        _id,
        name,
        "orderCount": count(*[_type == "order" && references(^._id)]),
        "totalSold": sum(*[_type == "order" && references(^._id)].products[product._ref == ^._id].quantity)
      } | order(orderCount desc)[0...5]
    }`);

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}