import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
    name: 'product',
    title: 'Products',
    type: 'document',   
    icon: TrolleyIcon,

    fields: [
        defineField({
            name: 'name',
            title: 'Product Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
              source: 'name',
              maxLength: 96,
            },
        }),
        defineField({
            name: 'image',
            title: 'Product Image',
            type: 'image',
            options: {
                hotspot: true
            }
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'blockContent',
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: (Rule) => Rule.required().min(0),
        }),
        defineField({
            name: 'salePrice',
            title: 'Sale Price',
            type: 'number',
            validation: (Rule) => 
                Rule.min(0)
                    .custom((salePrice, context) => {
                        const { document } = context;
                        const regularPrice = document?.price;
                        if (salePrice && typeof regularPrice === 'number' && salePrice >= regularPrice) {
                            return 'Sale price must be less than regular price';
                        }
                        return true;
                    }),
            description: 'Set a sale price that is lower than the regular price'
        }),
        defineField({
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: {type: "category"} }],
        }),
        defineField({
            name: 'sku',
            title: 'SKU',
            type: 'string'
        }),
        defineField({
            name: 'stock',
            title: 'Stock',
            type: 'number',
            validation: (Rule) => Rule.min(0),
        })
    ],

    preview: {
        select: {
            title: 'name',
            media: 'image',
            price: 'price',
            salePrice: 'salePrice'
        },
        prepare(select){
            const { title, media, price, salePrice } = select;
            const displayPrice = salePrice ? `$${salePrice} (Was $${price})` : `$${price}`;
            return {
                title,
                media,
                subtitle: `Price: ${displayPrice}`
            }
        }
    }
});