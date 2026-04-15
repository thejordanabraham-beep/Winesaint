import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short description for article cards',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'News', value: 'news' },
        { label: 'Education', value: 'education' },
        { label: 'Vintage Report', value: 'vintage-report' },
        { label: 'Producer Profile', value: 'producer-profile' },
        { label: 'Region Deep Dive', value: 'region-deep-dive' },
        { label: 'Opinion', value: 'opinion' },
      ],
    },
    // Cross-linking fields
    {
      name: 'relatedRegions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
    },
    {
      name: 'relatedWines',
      type: 'relationship',
      relationTo: 'wines',
      hasMany: true,
    },
    {
      name: 'relatedProducers',
      type: 'relationship',
      relationTo: 'producers',
      hasMany: true,
    },
    {
      name: 'relatedGrapes',
      type: 'relationship',
      relationTo: 'grapes',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
}
