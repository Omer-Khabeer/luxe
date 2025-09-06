// schemas/order.ts
import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(255),
      readOnly: true,
    }),
    defineField({
      name: "stripeCheckoutSessionID",
      title: "Stripe Checkout Session ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "stripeCustomerID",
      title: "Stripe Customer ID",
      type: "string",
    }),
    defineField({
      name: "clerkID",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(255),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "stripePaymentIntentID",
      title: "Stripe Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required().min(3).max(3),
      initialValue: "EUR",
    }),
    // Enhanced shipping information
    defineField({
      name: "shippingInfo",
      title: "Shipping Information",
      type: "object",
      fields: [
        defineField({
          name: "address",
          title: "Address",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
          initialValue: "Deutschland",
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "deliveryInstructions",
          title: "Delivery Instructions",
          type: "text",
        }),
      ],
    }),
    // Order status fields
    defineField({
      name: "orderStatus",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "processing",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    // Email status tracking
    defineField({
      name: "emailStatus",
      title: "Email Status",
      type: "object",
      fields: [
        defineField({
          name: "confirmationSent",
          title: "Confirmation Email Sent",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "confirmationSentAt",
          title: "Confirmation Sent At",
          type: "datetime",
        }),
        defineField({
          name: "notificationSent",
          title: "Admin Notification Sent",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "notificationSentAt",
          title: "Notification Sent At",
          type: "datetime",
        }),
      ],
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product Bought",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantity Purchased",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            // Add variant/size info if needed
            defineField({
              name: "variant",
              title: "Product Variant/Size",
              type: "string",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              variant: "variant",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              const variantText = select.variant ? ` (${select.variant})` : '';
              return {
                title: `${select.product}${variantText} x ${select.quantity}`,
                subtitle: `${(select.price * select.quantity).toFixed(2)} ${select.currency}`,
                media: select.image,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    // Tracking fields
    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
    }),
    defineField({
      name: "shippingCarrier",
      title: "Shipping Carrier",
      type: "string",
      options: {
        list: [
          { title: "DHL", value: "dhl" },
          { title: "DPD", value: "dpd" },
          { title: "Hermes", value: "hermes" },
          { title: "UPS", value: "ups" },
          { title: "FedEx", value: "fedex" },
        ],
      },
    }),
    // Notes field
    defineField({
      name: "notes",
      title: "Order Notes",
      type: "text",
      description: "Internal notes about this order",
    }),
    defineField({
      name: "customerNotes",
      title: "Customer Notes",
      type: "text",
      description: "Notes from the customer",
    }),
  ],
  orderings: [
    {
      title: 'Order Date, New',
      name: 'createdAtDesc',
      by: [
        {field: '_createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Order Date, Old',
      name: 'createdAtAsc',
      by: [
        {field: '_createdAt', direction: 'asc'}
      ]
    },
    {
      title: 'Order Number',
      name: 'orderNumberDesc',
      by: [
        {field: 'orderNumber', direction: 'desc'}
      ]
    }
  ],
  preview: {
    select: {
      customerName: "customerName",
      totalPrice: "totalPrice",
      currency: "currency",
      orderNumber: "orderNumber",
      email: "email",
      orderStatus: "orderStatus",
      paymentStatus: "paymentStatus",
      createdAt: "_createdAt",
    },
    prepare(select) {
      const orderIdSnippet = select.orderNumber 
        ? `${select.orderNumber.slice(0, 8)}...${select.orderNumber.slice(-4)}` 
        : 'N/A';
      
      const statusEmoji = {
        processing: "🔄",
        shipped: "📦",
        delivered: "✅",
        cancelled: "❌",
        refunded: "💰",
      }[select.orderStatus] || "📋";

      const paymentEmoji = {
        pending: "⏳",
        paid: "💳",
        failed: "❌",
        refunded: "💰",
      }[select.paymentStatus] || "❓";

      return {
        title: `${statusEmoji} ${select.customerName} - ${orderIdSnippet}`,
        subtitle: `${paymentEmoji} ${select.totalPrice} ${select.currency} - ${select.email} - ${new Date(select.createdAt).toLocaleDateString()}`,
        media: BasketIcon,
      };
    },
  },
});