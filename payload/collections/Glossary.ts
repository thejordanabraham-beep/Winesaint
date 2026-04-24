import type { CollectionConfig } from 'payload'

export const Glossary: CollectionConfig = {
  slug: 'glossary',
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'term',
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
      name: 'definition',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Winemaking', value: 'winemaking' },
        { label: 'Viticulture', value: 'viticulture' },
        { label: 'Tasting', value: 'tasting' },
        { label: 'Regions', value: 'regions' },
        { label: 'Grapes', value: 'grapes' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'relatedTerms',
      type: 'array',
      fields: [
        {
          name: 'term',
          type: 'text',
        },
      ],
    },
    {
      name: 'pronunciation',
      type: 'text',
    },
    {
      name: 'etymology',
      type: 'text',
    },
  ],
}
