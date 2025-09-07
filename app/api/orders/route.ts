// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    // If no email provided, return empty results
    if (!email) {
      return NextResponse.json({
        orders: [],
        pagination: {
          page: 1,
          limit: 10,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    // Build query to filter by email
    let query = `*[_type == "order" && email == $email`;
    const params: Record<string, any> = { email };
    
    if (status && status !== 'all') { 
      query += ` && orderStatus == $status`; 
      params.status = status; 
    }
    
    query += `] | order(_createdAt desc)`;

    const start = (page - 1) * limit;
    query += `[${start}...${start + limit}] {
      _id, orderNumber, customerName, email, totalPrice, currency,
      orderStatus, paymentStatus, trackingNumber, shippingCarrier, shippingInfo,
      products[]{ quantity, variant, product->{ _id, name, price, image, slug } },
      emailStatus, _createdAt, _updatedAt
    }`;

    const orders = await client.fetch(query, params);

    // Get total count
    let countQuery = `count(*[_type == "order" && email == $email`;
    if (status && status !== 'all') countQuery += ` && orderStatus == $status`;
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
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}