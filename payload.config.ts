import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ============ COLLECTIONS ============

const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
    },
  ],
}

const Media: CollectionConfig = {
  slug: 'media',
  admin: { useAsTitle: 'alt' },
  access: { read: () => true },
  upload: { staticDir: 'media', mimeTypes: ['image/*'] },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}

const Regions: CollectionConfig = {
  slug: 'regions',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'level', 'parentRegion', 'country'] },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'fullSlug', type: 'text', required: true, unique: true, index: true },
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
    { name: 'country', type: 'text', required: true },
    { name: 'parentRegion', type: 'relationship', relationTo: 'regions' },
    {
      name: 'classification',
      type: 'select',
      options: [
        { label: 'Grand Cru', value: 'grand_cru' },
        { label: 'Premier Cru', value: 'premier_cru' },
        { label: 'Village', value: 'village' },
        { label: 'MGA', value: 'mga' },
        { label: 'Grosses Gewächs', value: 'grosses_gewachs' },
        { label: 'Erste Lage', value: 'erste_lage' },
        { label: 'Grosse Lage', value: 'grosse_lage' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'sidebarTitle', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'acreage', type: 'number' },
    { name: 'aspect', type: 'text' },
  ],
}

const Producers: CollectionConfig = {
  slug: 'producers',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'region', 'country'] },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'region', type: 'relationship', relationTo: 'regions', required: true },
    { name: 'country', type: 'text' },
    { name: 'summary', type: 'textarea', admin: { description: 'Brief summary for preview cards (2-3 sentences)' } },
    { name: 'description', type: 'richText' },
    { name: 'website', type: 'text' },
    { name: 'founded', type: 'number' },
    { name: 'winemaker', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

const Vintages: CollectionConfig = {
  slug: 'vintages',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['year', 'region', 'rating', 'quality']
  },
  access: { read: () => true },
  fields: [
    { name: 'year', type: 'number', required: true, min: 1900, max: 2100 },
    { name: 'region', type: 'relationship', relationTo: 'regions', required: true },
    { name: 'displayName', type: 'text', admin: { description: 'Auto-generated: "2024 Wachau"' } },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: { description: 'Vintage quality rating (1-5 stars)' },
    },
    { name: 'drinkFrom', type: 'number', admin: { description: 'Year when wines start drinking well' } },
    { name: 'drinkUntil', type: 'number', admin: { description: 'Year when wines are past peak' } },
    { name: 'weather', type: 'textarea', admin: { description: 'Growing season weather summary' } },
    { name: 'harvest', type: 'text', admin: { description: 'Harvest timing (early/normal/late)' } },
    {
      name: 'yields',
      type: 'select',
      options: [
        { label: 'Very Low', value: 'very_low' },
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
      ],
    },
    { name: 'summary', type: 'textarea', admin: { description: 'Brief vintage summary for cards' } },
    { name: 'notes', type: 'richText', admin: { description: 'Full vintage report' } },
  ],
}

const Grapes: CollectionConfig = {
  slug: 'grapes',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'color',
      type: 'select',
      required: true,
      options: [
        { label: 'Red', value: 'red' },
        { label: 'White', value: 'white' },
        { label: 'Pink', value: 'pink' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'primaryRegions', type: 'relationship', relationTo: 'regions', hasMany: true },
    { name: 'history', type: 'richText' },
    { name: 'viticulture', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

const Wines: CollectionConfig = {
  slug: 'wines',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'vintage', 'producer', 'region'] },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'vintage', type: 'number', required: true },
    { name: 'producer', type: 'relationship', relationTo: 'producers', required: true },
    { name: 'region', type: 'relationship', relationTo: 'regions', required: true },
    { name: 'vineyard', type: 'relationship', relationTo: 'regions', admin: { description: 'Link to vineyard page if it exists' } },
    { name: 'vineyardName', type: 'text', admin: { description: 'Vineyard name (always stored, even if no page exists)' } },
    { name: 'vintageReport', type: 'relationship', relationTo: 'vintages', admin: { description: 'Link to vintage report for this region+year (optional)' } },
    { name: 'grapes', type: 'relationship', relationTo: 'grapes', hasMany: true },
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
    { name: 'priceUsd', type: 'number' },
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
    { name: 'alcoholPercentage', type: 'number' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: { useAsTitle: 'wine', defaultColumns: ['wine', 'score', 'reviewerName', 'reviewDate'] },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'wine', type: 'relationship', relationTo: 'wines', required: true },
    { name: 'score', type: 'number', required: true, min: 1, max: 10 },
    { name: 'tastingNotes', type: 'textarea', required: true },
    { name: 'shortSummary', type: 'text' },
    {
      name: 'flavorProfile',
      type: 'array',
      admin: { description: 'Flavor descriptors (e.g., "green apple", "lemon zest")' },
      fields: [{ name: 'flavor', type: 'text' }],
    },
    {
      name: 'foodPairings',
      type: 'array',
      admin: { description: 'Suggested food pairings (optional)' },
      fields: [{ name: 'pairing', type: 'text' }],
    },
    { name: 'drinkThisIf', type: 'text' },
    { name: 'drinkingWindowStart', type: 'number' },
    { name: 'drinkingWindowEnd', type: 'number' },
    { name: 'reviewerName', type: 'text', required: true },
    { name: 'reviewDate', type: 'date' },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false },
  ],
}

const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', 'author', 'publishedAt'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
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
    { name: 'excerpt', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
    { name: 'author', type: 'text', required: true },
    { name: 'publishedAt', type: 'date' },
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
    { name: 'relatedRegions', type: 'relationship', relationTo: 'regions', hasMany: true },
    { name: 'relatedWines', type: 'relationship', relationTo: 'wines', hasMany: true },
    { name: 'relatedProducers', type: 'relationship', relationTo: 'producers', hasMany: true },
    { name: 'relatedGrapes', type: 'relationship', relationTo: 'grapes', hasMany: true },
  ],
}

// ============ CONFIG ============

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Regions,
    Vintages,
    Wines,
    Reviews,
    Producers,
    Grapes,
    Articles,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
})
