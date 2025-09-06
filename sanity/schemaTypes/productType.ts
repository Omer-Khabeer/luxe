import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,

  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "size",
              title: "Size Label",
              type: "string",
              options: {
                list: ["250 gr", "500 gr", "1 kg"], // ✅ restrict admin to only these 3
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "price",
              title: "Price (€)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "stock",
              title: "Stock",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            },
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required().min(3).max(3).error("Must define all 3 sizes (250g, 500g, 1kg)"),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "image",
      sizes: "sizes",
    },
    prepare({ title, media, sizes }) {
      const sizeLabels = sizes?.map((s: any) => `${s.size}: €${s.price}`).join(", ");
      return {
        title,
        media,
        subtitle: sizeLabels || "No sizes set",
      };
    },
  },
});
