export const vineyard = {
  name: 'vineyard',
  title: 'Vineyard',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Official vineyard name (e.g., "La Jota Vineyard")',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'appellation',
      title: 'Appellation (AVA)',
      type: 'reference',
      to: [{ type: 'appellation' }],
      validation: (Rule: any) => Rule.required(),
      description: 'The AVA this vineyard belongs to',
    },
    {
      name: 'boundaries',
      title: 'Boundary Coordinates (GeoJSON)',
      type: 'object',
      fields: [
        {
          name: 'type',
          title: 'Type',
          type: 'string',
          initialValue: 'Feature',
        },
        {
          name: 'geometry',
          title: 'Geometry',
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Geometry Type',
              type: 'string',
              initialValue: 'Polygon',
            },
            {
              name: 'coordinates',
              title: 'Coordinates',
              type: 'array',
              of: [
                {
                  type: 'array',
                  of: [
                    {
                      type: 'array',
                      of: [{ type: 'number' }],
                    },
                  ],
                },
              ],
              description: 'GeoJSON polygon coordinates [lng, lat]',
            },
          ],
        },
        {
          name: 'properties',
          title: 'Properties',
          type: 'object',
          fields: [
            { name: 'fillColor', title: 'Fill Color', type: 'string' },
            { name: 'strokeColor', title: 'Stroke Color', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'labelPosition',
      title: 'Label Position',
      type: 'object',
      fields: [
        { name: 'longitude', title: 'Longitude', type: 'number' },
        { name: 'latitude', title: 'Latitude', type: 'number' },
      ],
      description: 'Center point for label placement',
    },
    {
      name: 'acreage',
      title: 'Total Acreage',
      type: 'number',
    },
    {
      name: 'elevationRange',
      title: 'Elevation Range',
      type: 'object',
      fields: [
        { name: 'min', title: 'Min (ft)', type: 'number' },
        { name: 'max', title: 'Max (ft)', type: 'number' },
      ],
    },
    {
      name: 'soilTypes',
      title: 'Soil Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Volcanic', value: 'volcanic' },
          { title: 'Clay', value: 'clay' },
          { title: 'Loam', value: 'loam' },
          { title: 'Gravel', value: 'gravel' },
          { title: 'Alluvial', value: 'alluvial' },
          { title: 'Limestone', value: 'limestone' },
          { title: 'Sandy', value: 'sandy' },
        ],
      },
    },
    {
      name: 'primaryGrapes',
      title: 'Primary Grape Varieties',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'currentOwner',
      title: 'Current Owner/Producer',
      type: 'reference',
      to: [{ type: 'producer' }],
    },
    {
      name: 'fruitBuyers',
      title: 'Wineries That Source Fruit',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'producer' }] }],
      description: 'Wineries that buy grapes from this vineyard',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'appellation.name',
      media: 'image',
    },
  },
};
