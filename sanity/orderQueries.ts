// lib/sanity/orderQueries.js
export const orderQueries = {
  // Get all orders with pagination and filters
  getAllOrders: (filters = {}) => {
    const { status, search, limit = 20, offset = 0 } = filters;
    let query = `*[_type == "order"`;
    const params = {};

    if (status && status !== 'all') {
      query += ` && orderStatus == $status`;
      params.status = status;
    }

    if (search) {
      query += ` && (customerName match $search || email match $search || orderNumber match $search)`;
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

  // Get order statistics
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
      "revenue": sum(*[_type == "order" && paymentStatus == "paid" && references(^._id)].products[product._ref == ^._id].quantity) * ^.price
    }[orderCount > 0] | order(orderCount desc)[0...10]
  }`,

  // Get orders that need attention (failed payments, processing too long, etc.)
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

  // Get monthly revenue data
  getMonthlyRevenue: `
    *[_type == "order" && paymentStatus == "paid" && _createdAt > $fromDate] {
      totalPrice,
      currency,
      "month": dateTime(_createdAt).format("YYYY-MM")
    } | group by month {
      "month": @.month,
      "revenue": sum(@.totalPrice),
      "orders": count(@)
    } | order(month asc)
  `,
};

// lib/sanity/orderUtils.js
export const orderUtils = {
  // Create a new order
  createOrder: async (client, orderData) => {
    try {
      const result = await client.create({
        _type: 'order',
        ...orderData,
      });
      return { success: true, order: result };
    } catch (error) {
      console.error('Failed to create order:', error);
      return { success: false, error: error.message };
    }
  },

  // Update order status
  updateOrderStatus: async (client, orderId, status, additionalData = {}) => {
    try {
      const result = await client
        .patch(orderId)
        .set({
          orderStatus: status,
          _updatedAt: new Date().toISOString(),
          ...additionalData,
        })
        .commit();
      
      return { success: true, order: result };
    } catch (error) {
      console.error('Failed to update order:', error);
      return { success: false, error: error.message };
    }
  },

  // Update payment status
  updatePaymentStatus: async (client, paymentIntentId, status) => {
    try {
      const orders = await client.fetch(
        `*[_type == "order" && stripePaymentIntentID == $paymentIntentId]`,
        { paymentIntentId }
      );

      const results = await Promise.all(
        orders.map(order =>
          client
            .patch(order._id)
            .set({
              paymentStatus: status,
              _updatedAt: new Date().toISOString(),
            })
            .commit()
        )
      );

      return { success: true, orders: results };
    } catch (error) {
      console.error('Failed to update payment status:', error);
      return { success: false, error: error.message };
    }
  },

  // Add tracking information
  addTrackingInfo: async (client, orderId, trackingNumber, carrier) => {
    try {
      const result = await client
        .patch(orderId)
        .set({
          trackingNumber,
          shippingCarrier: carrier,
          orderStatus: 'shipped',
          _updatedAt: new Date().toISOString(),
        })
        .commit();
      
      return { success: true, order: result };
    } catch (error) {
      console.error('Failed to add tracking info:', error);
      return { success: false, error: error.message };
    }
  },

  // Update inventory after order
  updateInventory: async (client, products) => {
    try {
      const transaction = client.transaction();
      
      for (const item of products) {
        if (item.productId) {
          transaction.patch(item.productId).dec({ 
            inventory: item.quantity || 1 
          });
        }
      }
      
      await transaction.commit();
      return { success: true };
    } catch (error) {
      console.error('Failed to update inventory:', error);
      return { success: false, error: error.message };
    }
  },

  // Restore inventory after cancellation
  restoreInventory: async (client, products) => {
    try {
      const transaction = client.transaction();
      
      for (const item of products) {
        if (item.productId) {
          transaction.patch(item.productId).inc({ 
            inventory: item.quantity || 1 
          });
        }
      }
      
      await transaction.commit();
      return { success: true };
    } catch (error) {
      console.error('Failed to restore inventory:', error);
      return { success: false, error: error.message };
    }
  },

  // Get order summary for analytics
  getOrderSummary: async (client, dateFrom, dateTo) => {
    try {
      const summary = await client.fetch(`{
        "totalOrders": count(*[_type == "order" && _createdAt >= $dateFrom && _createdAt <= $dateTo]),
        "totalRevenue": sum(*[_type == "order" && paymentStatus == "paid" && _createdAt >= $dateFrom && _createdAt <= $dateTo].totalPrice),
        "averageOrderValue": avg(*[_type == "order" && paymentStatus == "paid" && _createdAt >= $dateFrom && _createdAt <= $dateTo].totalPrice),
        "topSellingProducts": *[_type == "product"] {
          _id,
          name,
          "soldQuantity": sum(*[_type == "order" && paymentStatus == "paid" && _createdAt >= $dateFrom && _createdAt <= $dateTo && references(^._id)].products[product._ref == ^._id].quantity)
        }[soldQuantity > 0] | order(soldQuantity desc)[0...5]
      }`, { dateFrom, dateTo });
      
      return { success: true, summary };
    } catch (error) {
      console.error('Failed to get order summary:', error);
      return { success: false, error: error.message };
    }
  },
};

// Export default object with both queries and utils
export default {
  queries: orderQueries,
  utils: orderUtils,
};