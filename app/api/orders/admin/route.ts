// app/api/orders/admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// Simple admin authentication check
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  // Option 1: Check for admin API key in headers
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    return true;
  }

  // Option 2: Check for session-based auth (if you implement sessions)
  // const session = request.headers.get('authorization');
  // return validateAdminSession(session);

  // For now, return true to allow access (remove in production)
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query = `*[_type == "order"`;
    const params: any = {};

    // Add filters
    const filters = [];
    
    if (status && status !== 'all') {
      filters.push(`orderStatus == $status`);
      params.status = status;
    }

    if (search) {
      filters.push(`(customerName match $search || email match $search || orderNumber match $search)`);
      params.search = `*${search}*`;
    }

    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`;
    }

    query += `] | order(_createdAt desc)`;

    // Add pagination
    const start = (page - 1) * limit;
    query += `[${start}...${start + limit}]`;

    // Add fields to fetch
    query += ` {
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
    }`;

    const orders = await client.fetch(query, params);

    // Get total count for pagination
    let countQuery = `count(*[_type == "order"`;
    if (filters.length > 0) {
      countQuery += ` && (${filters.join(' && ')})`;
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
    console.error('Failed to fetch admin orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST method to create manual orders (admin only)
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      customerName,
      email,
      products,
      totalPrice,
      currency = 'EUR',
      shippingInfo,
      notes,
    } = body;

    // Validate required fields
    if (!customerName || !email || !products || products.length === 0 || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `MANUAL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order
    const orderData = {
      _type: 'order',
      orderNumber,
      stripeCheckoutSessionID: '', // Empty for manual orders
      stripeCustomerID: '',
      customerName,
      email,
      stripePaymentIntentID: '', // Empty for manual orders
      totalPrice,
      amountDiscount: 0,
      currency: currency.toUpperCase(),
      orderStatus: 'processing',
      paymentStatus: 'paid', // Assume manual orders are already paid
      shippingInfo: shippingInfo || {},
      products: products.map((item: any) => ({
        _type: 'object',
        product: {
          _type: 'reference',
          _ref: item.productId,
        },
        quantity: item.quantity,
        variant: item.variant || '',
      })),
      notes: notes || '',
      emailStatus: {
        confirmationSent: false,
        notificationSent: false,
      },
    };

    const result = await client.create(orderData);

    return NextResponse.json({
      success: true,
      orderId: result._id,
      orderNumber: result.orderNumber,
    });

  } catch (error) {
    console.error('Failed to create manual order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}