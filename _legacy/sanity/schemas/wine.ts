export const wine = {
  name: 'wine',
  title: 'Wine',
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
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'producer',
      title: 'Producer',
      type: 'reference',
      to: [{ type: 'producer' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{ type: 'region' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'appellation',
      title: 'Appellation',
      type: 'reference',
      to: [{ type: 'appellation' }],
      description: 'The specific AVA/AOC/appellation (e.g., Howell Mountain, Mosel, Vosne-Romanée)',
    },
    {
      name: 'vineyard',
      title: 'Vineyard',
      type: 'reference',
      to: [{ type: 'vineyard' }],
      description: 'Specific vineyard or vineyard parcel (e.g., Marienburg, Rothenpfad, Fahrlay-Terrassen)',
    },
    {
      name: 'climat',
      title: 'Climat/Cru',
      type: 'reference',
      to: [{ type: 'climat' }],
      description: 'Burgundy climat, Barolo MGA, or other single-vineyard designation',
    },
    {
      name: 'grapeVarieties',
      title: 'Grape Varieties',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.min(1),
    },
    {
      name: 'wineType',
      title: 'Wine Type',
      type: 'string',
      options: {
        list: [
          { title: 'Red', value: 'red' },
          { title: 'White', value: 'white' },
          { title: 'Rosé', value: 'rose' },
          { title: 'Sparkling', value: 'sparkling' },
          { title: 'Dessert', value: 'dessert' },
          { title: 'Fortified', value: 'fortified' },
        ],
      },
      description: 'Type/color of wine',
    },
    {
      name: 'vintage',
      title: 'Vintage',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(1900).max(new Date().getFullYear()),
    },
    {
      name: 'priceUsd',
      title: 'Price (USD)',
      type: 'number',
      description: 'Retail price in US dollars',
    },
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      options: {
        list: [
          { title: 'Budget ($)', value: 'budget' },
          { title: 'Mid-range ($$)', value: 'mid-range' },
          { title: 'Premium ($$$)', value: 'premium' },
          { title: 'Luxury ($$$$)', value: 'luxury' },
        ],
      },
    },
    {
      name: 'alcoholPercentage',
      title: 'Alcohol %',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(25),
    },
    {
      name: 'criticAvg',
      title: 'Critic Average Score',
      type: 'number',
      description: 'Average critic score (0-100)',
      validation: (Rule: any) => Rule.min(0).max(100),
    },
    {
      name: 'vivinoScore',
      title: 'Vivino Score',
      type: 'number',
      description: 'Vivino user rating (0-5)',
      validation: (Rule: any) => Rule.min(0).max(5),
    },
    {
      name: 'flavorMentions',
      title: 'Flavor Mentions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Common flavor descriptors mentioned in reviews',
    },
    {
      name: 'hasAiReview',
      title: 'Has AI Review',
      type: 'boolean',
      initialValue: false,
      description: 'Whether an AI-generated review exists for this wine',
    },
    {
      name: 'image',
      title: 'Bottle Image',
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
      vintage: 'vintage',
      producer: 'producer.name',
      media: 'image',
    },
    prepare({ title, vintage, producer, media }: any) {
      return {
        title: `${title} ${vintage}`,
        subtitle: producer,
        media,
      };
    },
  },
};
