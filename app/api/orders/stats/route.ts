// app/api/orders/stats/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '../../../../lib/sanity';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminUserIds = process.env.ADMIN_USER_IDS?.split(',') || [];
    if (!adminUserIds.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
  } catch (e) {
    console.error('Failed to fetch order stats:', e);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
