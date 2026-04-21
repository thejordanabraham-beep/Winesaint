export const vintageReport = {
  name: 'vintageReport',
  title: 'Vintage Report',
  type: 'document',
  fields: [
    {
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'year',
      title: 'Vintage Year',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1900).max(new Date().getFullYear()),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => `${doc.year}`,
        maxLength: 96,
      },
    },
    {
      name: 'overview',
      title: 'Overview',
      type: 'text',
      rows: 8,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'conditionsNotes',
      title: 'Growing Conditions Notes',
      type: 'text',
      rows: 4,
    },
    {
      name: 'overallRating',
      title: 'Overall Rating',
      type: 'string',
      options: {
        list: [
          { title: 'Poor', value: 'poor' },
          { title: 'Fair', value: 'fair' },
          { title: 'Good', value: 'good' },
          { title: 'Very Good', value: 'very_good' },
          { title: 'Excellent', value: 'excellent' },
          { title: 'Outstanding', value: 'outstanding' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'featuredWines',
      title: 'Featured Wines',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'wine' }],
        },
      ],
    },
    {
      name: 'image',
      title: 'Cover Image',
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
      region: 'region.name',
      year: 'year',
      rating: 'overallRating',
      media: 'image',
    },
    prepare({ region, year, rating, media }: any) {
      return {
        title: `${region} ${year}`,
        subtitle: rating,
        media,
      };
    },
  },
};
