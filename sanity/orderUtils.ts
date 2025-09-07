import { SanityClient } from "@sanity/client";

export const orderUtils = {
  // Create a new order
  async createOrder(client: SanityClient, orderData: Record<string, any>) {
    try {
      const result = await client.create({ _type: "order", ...orderData });
      return { success: true, order: result };
    } catch (error: any) {
      console.error("Failed to create order:", error);
      return { success: false, error: error.message };
    }
  },

  // Update order status
  async updateOrderStatus(
    client: SanityClient,
    orderId: string,
    status: string,
    additionalData: Record<string, any> = {}
  ) {
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
    } catch (error: any) {
      console.error("Failed to update order:", error);
      return { success: false, error: error.message };
    }
  },

  // Update inventory after order
  async updateInventory(
    client: SanityClient,
    products: { productId?: string; quantity?: number }[]
  ) {
    try {
      const tx = client.transaction();

      for (const item of products) {
        if (item.productId) {
          const patch = client.patch(item.productId).dec({
            inventory: item.quantity || 1,
          });
          tx.patch(patch);
        }
      }

      await tx.commit();
      return { success: true };
    } catch (error: any) {
      console.error("Failed to update inventory:", error);
      return { success: false, error: error.message };
    }
  },
};
