import type { CollectionConfig } from 'payload'

export const Regions: CollectionConfig = {
  slug: 'regions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'level', 'parentRegion', 'country'],
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
      admin: {
        description: 'URL-friendly identifier (e.g., "mosel", "cote-de-nuits")',
      },
    },
    {
      name: 'fullSlug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Full path (e.g., "germany/mosel", "france/burgundy/cote-de-nuits")',
      },
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Country', value: 'country' },
        { label: 'Region', value: 'region' },
        { label: 'Sub-Region', value: 'subregion' },
        { label: 'Village', value: 'village' },
        { label: 'Vineyard', value: 'vineyard' },
      ],
    },
    {
      name: 'country',
      type: 'text',
      required: true,
    },
    {
      name: 'parentRegion',
      type: 'relationship',
      relationTo: 'regions',
      admin: {
        description: 'Parent region in the hierarchy',
      },
    },
    {
      name: 'classification',
      type: 'select',
      options: [
        { label: 'Grand Cru', value: 'grand_cru' },
        { label: 'Premier Cru', value: 'premier_cru' },
        { label: 'Village', value: 'village' },
        { label: 'Regional', value: 'regional' },
        { label: 'MGA', value: 'mga' },
        { label: 'Grosses Gewächs', value: 'grosses_gewachs' },
        { label: 'Erste Lage', value: 'erste_lage' },
        { label: 'Grosse Lage', value: 'grosse_lage' },
      ],
      admin: {
        description: 'Classification (for vineyards/climats)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description for previews',
      },
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Full guide content',
      },
    },
    {
      name: 'sidebarTitle',
      type: 'text',
      admin: {
        description: 'Custom sidebar title (e.g., "Sub-Regions", "Vineyards")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    // Vineyard-specific fields
    {
      name: 'acreage',
      type: 'number',
      admin: {
        condition: (data) => data?.level === 'vineyard',
        description: 'Size in hectares',
      },
    },
    {
      name: 'soilTypes',
      type: 'array',
      admin: {
        condition: (data) => data?.level === 'vineyard',
      },
      fields: [
        {
          name: 'soil',
          type: 'text',
        },
      ],
    },
    {
      name: 'aspect',
      type: 'select',
      options: [
        { label: 'North', value: 'north' },
        { label: 'Northeast', value: 'northeast' },
        { label: 'East', value: 'east' },
        { label: 'Southeast', value: 'southeast' },
        { label: 'South', value: 'south' },
        { label: 'Southwest', value: 'southwest' },
        { label: 'West', value: 'west' },
        { label: 'Northwest', value: 'northwest' },
      ],
      admin: {
        condition: (data) => data?.level === 'vineyard',
      },
    },
    {
      name: 'elevationMin',
      type: 'number',
      admin: {
        condition: (data) => data?.level === 'vineyard',
        description: 'Minimum elevation (meters)',
      },
    },
    {
      name: 'elevationMax',
      type: 'number',
      admin: {
        condition: (data) => data?.level === 'vineyard',
        description: 'Maximum elevation (meters)',
      },
    },
  ],
}
