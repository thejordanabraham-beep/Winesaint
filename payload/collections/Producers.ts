import type { CollectionConfig } from 'payload'

export const Producers: CollectionConfig = {
  slug: 'producers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'country'],
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
      name: 'region',
      type: 'relationship',
      relationTo: 'regions',
      required: true,
    },
    {
      name: 'country',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'founded',
      type: 'number',
      admin: {
        description: 'Year founded',
      },
    },
    {
      name: 'winemaker',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
