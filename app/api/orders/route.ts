// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '../../../lib/sanity'; // keep relative or ensure alias works

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');

    let query = `*[_type == "order" && clerkID == $userId`;
    const params: Record<string, any> = { userId };
    if (status) { query += ` && orderStatus == $status`; params.status = status; }
    query += `] | order(_createdAt desc)`;

    const start = (page - 1) * limit;
    query += `[${start}...${start + limit}] {
      _id, orderNumber, customerName, email, totalPrice, currency,
      orderStatus, paymentStatus, trackingNumber, shippingCarrier, shippingInfo,
      products[]{ quantity, variant, product->{ _id, name, price, image, slug } },
      emailStatus, _createdAt, _updatedAt
    }`;

    const orders = await client.fetch(query, params);

    let countQuery = `count(*[_type == "order" && clerkID == $userId`;
    if (status) countQuery += ` && orderStatus == $status`;
    countQuery += `])`;
    const totalCount = await client.fetch(countQuery, params);

    return NextResponse.json({
      orders,
      pagination: {
        page, limit, totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (e) {
    console.error('Failed to fetch orders:', e);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
