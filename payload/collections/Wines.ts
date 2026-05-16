import type { CollectionConfig } from 'payload'

export const Wines: CollectionConfig = {
  slug: 'wines',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'vintage', 'producer', 'region'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
      admin: {
        description: 'Wine name/cuvée (blank for estate wines with no cuvée)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'vintage',
      type: 'number',
      required: true,
    },
    {
      name: 'producer',
      type: 'relationship',
      relationTo: 'producers',
      required: true,
    },
    {
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      required: true,
    },
    {
      name: 'vineyard',
      type: 'relationship',
      relationTo: 'regions',
      admin: {
        description: 'Specific vineyard (if applicable)',
      },
      filterOptions: {
        level: { equals: 'vineyard' },
      },
    },
    {
      name: 'grapes',
      type: 'relationship',
      relationTo: 'grapes',
      hasMany: true,
    },
    {
      name: 'wineType',
      type: 'select',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'White', value: 'white' },
        { label: 'Rosé', value: 'rose' },
        { label: 'Sparkling', value: 'sparkling' },
        { label: 'Dessert', value: 'dessert' },
        { label: 'Fortified', value: 'fortified' },
        { label: 'Orange', value: 'orange' },
      ],
    },
    {
      name: 'priceUsd',
      type: 'number',
      admin: {
        description: 'Price in USD',
      },
    },
    {
      name: 'priceRange',
      type: 'select',
      options: [
        { label: 'Budget ($)', value: 'budget' },
        { label: 'Mid-range ($$)', value: 'mid-range' },
        { label: 'Premium ($$$)', value: 'premium' },
        { label: 'Luxury ($$$$)', value: 'luxury' },
      ],
    },
    {
      name: 'alcoholPercentage',
      type: 'number',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    // ── Review fields (merged from Reviews collection) ──
    {
      name: 'score',
      type: 'number',
      min: 1,
      max: 10,
    },
    {
      name: 'tastingNotes',
      type: 'textarea',
    },
    {
      name: 'shortSummary',
      type: 'text',
    },
    {
      name: 'flavorProfile',
      type: 'array',
      fields: [{ name: 'flavor', type: 'text' }],
    },
    {
      name: 'foodPairings',
      type: 'array',
      fields: [{ name: 'pairing', type: 'text' }],
    },
    {
      name: 'drinkThisIf',
      type: 'text',
    },
    {
      name: 'drinkingWindowStart',
      type: 'number',
    },
    {
      name: 'drinkingWindowEnd',
      type: 'number',
    },
    {
      name: 'reviewerName',
      type: 'text',
    },
    {
      name: 'reviewDate',
      type: 'date',
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
