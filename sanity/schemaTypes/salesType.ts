import { TagIcon } from '@sanity/icons'
import { defineType } from 'sanity'

export const salesType =  defineType({
    name: 'sales',
    title: 'Sales',
    type: 'document',
    icon : TagIcon,
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'couponCode',
            title: 'Coupon Code',
            type: 'string',
        },
        {
            name: 'validFrom',
            title: 'Valid From',
            type: 'datetime',
        },
        {
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
        },
        {
            name: 'discountAmount',
            title: 'Discount Amount',
            type: 'number',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number',
        },
        {
            name: 'date',
            title: 'Date',
            type: 'datetime',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
    ],
preview: {
    select: {
        title: 'title',
        subtitle: 'couponCode',
        media: 'image',
    },
    prepare(selection) {
        const { title, subtitle, media } = selection
        return {
            title: title,
            subtitle: `Coupon Code: ${subtitle}`,
            media: media,
        }
    },
}
})