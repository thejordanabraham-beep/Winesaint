export const region = {
  name: 'region',
  title: 'Region',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (single segment)',
      type: 'slug',
      description: 'Just this region\'s slug (e.g. "chambolle-musigny")',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'fullSlug',
      title: 'Full Slug Path',
      type: 'string',
      description: 'Complete path (e.g. "france/burgundy/cote-de-nuits/chambolle-musigny")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'level',
      title: 'Region Level',
      type: 'string',
      options: {
        list: [
          { title: 'Country', value: 'country' },
          { title: 'Region', value: 'region' },
          { title: 'Sub-Region', value: 'subregion' },
          { title: 'Village', value: 'village' },
          { title: 'Vineyard', value: 'vineyard' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'parentRegion',
      title: 'Parent Region',
      type: 'reference',
      to: [{ type: 'region' }],
      description: 'The parent region in the hierarchy',
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'content',
      title: 'Full Content/Guide',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description: 'Full region guide content (converted from markdown)',
    },
    {
      name: 'sidebarLinks',
      title: 'Sidebar Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'slug',
              title: 'Slug',
              type: 'string',
            },
            {
              name: 'classification',
              title: 'Classification',
              type: 'string',
              options: {
                list: [
                  { title: 'Grand Cru', value: 'grand-cru' },
                  { title: 'Premier Cru', value: 'premier-cru' },
                  { title: 'Village', value: 'village' },
                  { title: 'Regional', value: 'regional' },
                  { title: 'Sub-Region', value: 'subregion' },
                ],
              },
            },
          ],
        },
      ],
      description: 'Child regions or vineyards shown in sidebar',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'fullSlug',
      media: 'image',
    },
  },
};
