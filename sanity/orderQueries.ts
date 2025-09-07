// sanity/orderQueries.ts

export type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "all"
  | string;

export interface OrderFilters {
  status?: OrderStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export const orderQueries = {
  /**
   * Get all orders with pagination and filters
   */
  getAllOrders(filters: OrderFilters = {}) {
    const { status, search, limit = 20, offset = 0 } = filters;

    let query = `*[_type == "order"`;
    const params: Record<string, unknown> = {};

    if (status && status !== "all") {
      query += ` && orderStatus == $status`;
      params.status = status;
    }

    if (search) {
      query += ` && (customerName match $search || email match $search || orderNumber match $search)`;
      // GROQ `match` uses wildcards
      params.search = `*${search}*`;
    }

    query += `] | order(_createdAt desc)[${offset}...${offset + limit}] {
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
      notes,
      _createdAt,
      _updatedAt
    }`;

    return { query, params };
  },

  // Get single order by ID
  getOrderById: `
    *[_type == "order" && _id == $orderId][0] {
      _id,
      orderNumber,
      stripeCheckoutSessionID,
      stripeCustomerID,
      clerkID,
      customerName,
      email,
      stripePaymentIntentID,
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
          slug,
          inventory
        }
      },
      emailStatus,
      notes,
      customerNotes,
      _createdAt,
      _updatedAt
    }
  `,

  // Get orders by user (Clerk ID)
  getOrdersByUser: `
    *[_type == "order" && clerkID == $userId] | order(_createdAt desc) {
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
      _createdAt
    }
  `,

  // Dashboard statistics
  getOrderStats: `{
    "totalOrders": count(*[_type == "order"]),
    "totalRevenue": sum(*[_type == "order" && paymentStatus == "paid"].totalPrice),
    "averageOrderValue": avg(*[_type == "order" && paymentStatus == "paid"].totalPrice),
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
      price,
      image,
      "orderCount": count(*[_type == "order" && references(^._id)]),
      "totalSold": sum(*[_type == "order" && references(^._id)].products[product._ref == ^._id].quantity),
      "revenue": sum(*[_type == "order" && paymentStatus == "paid" && references(^._id)].products[product._ref == ^._id].quantity) * coalesce(^.price, 0)
    }[orderCount > 0] | order(orderCount desc)[0...10]
  }`,

  // Orders that may need attention
  getOrdersNeedingAttention: `
    *[_type == "order" && (
      paymentStatus == "failed" ||
      (orderStatus == "processing" && _createdAt < now() - 60*60*24*2) ||
      orderStatus == "cancelled"
    )] | order(_createdAt desc) {
      _id,
      orderNumber,
      customerName,
      email,
      orderStatus,
      paymentStatus,
      totalPrice,
      currency,
      _createdAt
    }
  `,

  // Monthly revenue series (expects $fromDate)
  getMonthlyRevenue: `
    *[_type == "order" && paymentStatus == "paid" && _createdAt > $fromDate] {
      totalPrice,
      currency,
      "month": formatDateTime(_createdAt, "yyyy-MM")
    } | group(month) {
      "month": key,
      "revenue": sum(totalPrice),
      "orders": count()
    } | order(month asc)
  `,
} as const;

export default orderQueries;
