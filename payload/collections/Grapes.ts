import type { CollectionConfig } from 'payload'

export const Grapes: CollectionConfig = {
  slug: 'grapes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'color', 'primaryRegions'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'aliases',
      type: 'array',
      admin: {
        description: 'Alternative names (e.g., Shiraz for Syrah)',
      },
      fields: [
        {
          name: 'alias',
          type: 'text',
        },
      ],
    },
    {
      name: 'color',
      type: 'select',
      required: true,
      options: [
        { label: 'Red', value: 'red' },
        { label: 'White', value: 'white' },
        { label: 'Pink', value: 'pink' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description for cards',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Full grape guide content',
      },
    },
    {
      name: 'primaryRegions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
      admin: {
        description: 'Main regions where this grape is grown',
      },
    },
    {
      name: 'characteristics',
      type: 'group',
      fields: [
        {
          name: 'body',
          type: 'select',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Medium', value: 'medium' },
            { label: 'Full', value: 'full' },
          ],
        },
        {
          name: 'acidity',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
        },
        {
          name: 'tannins',
          type: 'select',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
          admin: {
            condition: (data) => data?.color === 'red',
          },
        },
      ],
    },
    {
      name: 'flavorProfile',
      type: 'array',
      fields: [
        {
          name: 'flavor',
          type: 'text',
        },
      ],
    },
    {
      name: 'history',
      type: 'richText',
    },
    {
      name: 'viticulture',
      type: 'richText',
      admin: {
        description: 'Growing conditions, disease issues, clonal selection',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
