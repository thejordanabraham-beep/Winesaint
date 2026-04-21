export const appellation = {
  name: 'appellation',
  title: 'Appellation (AVA)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'e.g., "Howell Mountain", "Stags Leap District"',
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
      name: 'parentRegion',
      title: 'Parent Region',
      type: 'reference',
      to: [{ type: 'region' }],
      description: 'e.g., California for Napa Valley',
    },
    {
      name: 'parentAppellation',
      title: 'Parent Appellation',
      type: 'reference',
      to: [{ type: 'appellation' }],
      description: 'For sub-AVAs (e.g., Howell Mountain → Napa Valley)',
    },
    {
      name: 'level',
      title: 'Hierarchy Level',
      type: 'string',
      options: {
        list: [
          { title: 'Continent', value: 'continent' },
          { title: 'Country', value: 'country' },
          { title: 'State/Region', value: 'state' },
          { title: 'Sub-Region', value: 'sub_region' },
          { title: 'Major AVA/Appellation', value: 'major_ava' },
          { title: 'Sub-AVA/Sub-Appellation', value: 'sub_ava' },
        ],
      },
      description: 'Used for map layer organization',
    },
    {
      name: 'boundaries',
      title: 'AVA Boundary (GeoJSON)',
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
      ],
    },
    {
      name: 'centerPoint',
      title: 'Map Center Point',
      type: 'object',
      fields: [
        { name: 'longitude', title: 'Longitude', type: 'number' },
        { name: 'latitude', title: 'Latitude', type: 'number' },
        { name: 'defaultZoom', title: 'Default Zoom', type: 'number', initialValue: 12 },
      ],
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'establishedYear',
      title: 'Year Established',
      type: 'number',
    },
    {
      name: 'totalAcreage',
      title: 'Total Acreage',
      type: 'number',
    },
    {
      name: 'image',
      title: 'Image',
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
      subtitle: 'parentRegion.name',
      media: 'image',
    },
  },
};
