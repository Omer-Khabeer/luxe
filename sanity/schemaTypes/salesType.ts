import { TagIcon } from '@sanity/icons'
import { defineType } from 'sanity'

export const salesType =  defineType({
    name: 'sale',
    title: 'Sale',
    type: 'document',
    icon : TagIcon,
    fields: [
        {
            name: 'title',
            title: 'Sale Title',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Sale Description',
            type: 'text',
        },
        {
            name: 'discountAmount',
            title: 'Discount Amount',
            type: 'number',
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
            name: 'validUntil',
            title: 'Valid Until',
            type: 'datetime',
        },
        {
            name: 'isActive',
            title: 'Is Active',
            type: 'boolean',
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