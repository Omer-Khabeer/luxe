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
      validation: (Rule) => Rule.required().min(1).max(255), // Ensure it's not empty and has length restrictions
    }),
    defineField({
      name: "stripeCheckoutSessionID",
      title: "Stripe Checkout Session ID",
      type: "string",
      validation: (Rule) => Rule,
    }),
    defineField({
      name: "stripeCustomerID",
      title: "Stripe Customer ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkID",
      title: "Clerk ID",
      type: "string",
      validation: (Rule) => Rule.required(),
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
      validation: (Rule) => Rule.required().min(3).max(3), // Ensure it's a valid 3-character currency code
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
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
              currency: "product.currency",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `${(select.price * select.quantity).toFixed(2)} ${select.currency}`,
                media: select.image,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1), // Ensure at least one product is purchased
    }),
  ],
  preview: {
    select: {
      customerName: "customerName",
      totalPrice: "totalPrice",
      currency: "currency",
      orderNumber: "orderNumber",
      email: "email",
    },
    prepare(select) {
      const orderIdSnippet = select.orderNumber ? `${select.orderNumber.slice(0, 5)} ... ${select.orderNumber.slice(-5)}` : 'N/A';
      return {
        title: `${select.customerName} - ${orderIdSnippet}`,
        subtitle: `${select.totalPrice} ${select.currency} - ${select.email}`,
        media: BasketIcon,
      };
    },
  },
});
