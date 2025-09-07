// sanity/schemaTypes/orderType.ts
import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  Loader2,
  Package,
  CheckCircle,
  XCircle,
  BadgeDollarSign,
  CreditCard,
  Hourglass,
  AlertTriangle,
} from "lucide-react";
import React from "react";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

interface OrderPreviewSelection {
  customerName?: string;
  orderNumber?: string;
  totalPrice?: number;
  currency?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  createdAt?: string;
}

// Helper to create an icon element without JSX
const iconEl = (
  Icon: React.ComponentType<{ className?: string; size?: number }>
, className: string, size = 18) =>
  React.createElement(Icon, { className, size });

// Media component for preview (no JSX)
const OrderStatusMedia: React.FC<{ status: OrderStatus; payment: PaymentStatus }> = ({
  status,
  payment,
}) => {
  const statusIconMap: Record<OrderStatus, React.ReactElement> = {
    processing: iconEl(Loader2, "text-blue-500 animate-spin"),
    shipped: iconEl(Package, "text-yellow-500"),
    delivered: iconEl(CheckCircle, "text-green-600"),
    cancelled: iconEl(XCircle, "text-red-600"),
    refunded: iconEl(BadgeDollarSign, "text-purple-500"),
  };

  const paymentIconMap: Record<PaymentStatus, React.ReactElement> = {
    pending: iconEl(Hourglass, "text-amber-500"),
    paid: iconEl(CreditCard, "text-green-600"),
    failed: iconEl(AlertTriangle, "text-red-600"),
    refunded: iconEl(BadgeDollarSign, "text-purple-500"),
  };

  return React.createElement(
    "div",
    { style: { display: "flex", gap: 6, alignItems: "center" } },
    statusIconMap[status],
    paymentIconMap[payment]
  );
};

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripeCheckoutSessionID",
      title: "Stripe Checkout Session ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stripeCustomerID",
      title: "Stripe Customer ID",
      type: "string",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
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
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "EUR",
    }),
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
    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
      description: "Package tracking number from shipping carrier",
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
    defineField({
      name: "shippingInfo",
      title: "Shipping Information",
      type: "object",
      fields: [
        defineField({
          name: "firstName",
          title: "First Name",
          type: "string",
        }),
        defineField({
          name: "lastName",
          title: "Last Name",
          type: "string",
        }),
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
        }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),
        defineField({
          name: "deliveryInstructions",
          title: "Delivery Instructions",
          type: "text",
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
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "variant",
              title: "Variant / Size",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "emailStatus",
      title: "Email Status",
      type: "object",
      fields: [
        defineField({
          name: "confirmationSent",
          title: "Confirmation Sent",
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
          title: "Notification Sent",
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
      name: "notes",
      title: "Internal Notes",
      type: "text",
      description: "Internal notes for admin use",
    }),
    defineField({
      name: "customerNotes",
      title: "Customer Notes",
      type: "text",
      description: "Notes or special requests from the customer",
    }),
  ],
  preview: {
    select: {
      customerName: "customerName",
      orderNumber: "orderNumber",
      totalPrice: "totalPrice",
      currency: "currency",
      orderStatus: "orderStatus",
      paymentStatus: "paymentStatus",
      createdAt: "_createdAt",
    },
    prepare(selection: OrderPreviewSelection) {
      const orderId = selection.orderNumber ?? "";
      const orderIdSnippet =
        orderId && orderId.length > 12
          ? `${orderId.slice(0, 8)}…${orderId.slice(-4)}`
          : orderId || "N/A";

      const status = (selection.orderStatus ?? "processing") as OrderStatus;
      const payment = (selection.paymentStatus ?? "pending") as PaymentStatus;
      const total = selection.totalPrice ?? 0;
      const currency = selection.currency ?? "EUR";
      const date = new Date(selection.createdAt ?? Date.now()).toLocaleDateString();

      return {
        title: `${selection.customerName ?? "Customer"} – ${orderIdSnippet}`,
        subtitle: `${status} • ${payment} • ${total} ${currency} • ${date}`,
        media: () => React.createElement(OrderStatusMedia, { status, payment }),
      };
    },
  },
});