// app/api/orders/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// Simple admin authentication check
async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  // Option 1: Check for admin API key in headers
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && adminKey === process.env.ADMIN_API_KEY) {
    return true;
  }

  // For now, return true to allow access (remove in production)
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await checkAdminAuth(request);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

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
      "recentOrders": *[_type == "order"] | order(_createdAt desc)[0...5]{
        _id, orderNumber, customerName, totalPrice, currency, orderStatus, _createdAt
      },
      "topProducts": *[_type == "product"]{
        _id, name,
        "orderCount": count(*[_type == "order" && references(^._id)]),
        "totalSold": sum(*[_type == "order" && references(^._id)].products[product._ref == ^._id].quantity)
      } | order(orderCount desc)[0...5]
    }`);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to fetch order stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}