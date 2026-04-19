import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'wine',
    defaultColumns: ['wine', 'score', 'reviewerName', 'reviewDate'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'wine',
      type: 'relationship',
      relationTo: 'wines',
      required: true,
    },
    {
      name: 'score',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      admin: {
        description: 'Score from 1-10',
      },
    },
    {
      name: 'tastingNotes',
      type: 'textarea',
      required: true,
    },
    {
      name: 'shortSummary',
      type: 'text',
      admin: {
        description: 'One sentence summary (max 20 words)',
      },
    },
    {
      name: 'flavorProfile',
      type: 'array',
      admin: {
        description: '4-6 flavor descriptors',
      },
      fields: [
        {
          name: 'flavor',
          type: 'text',
        },
      ],
    },
    {
      name: 'drinkThisIf',
      type: 'text',
      admin: {
        description: 'One sentence describing ideal buyer/occasion',
      },
    },
    {
      name: 'foodPairings',
      type: 'array',
      fields: [
        {
          name: 'pairing',
          type: 'text',
        },
      ],
    },
    {
      name: 'drinkingWindowStart',
      type: 'number',
      admin: {
        description: 'Year to start drinking',
      },
    },
    {
      name: 'drinkingWindowEnd',
      type: 'number',
      admin: {
        description: 'Year to stop drinking',
      },
    },
    {
      name: 'reviewerName',
      type: 'text',
      required: true,
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
