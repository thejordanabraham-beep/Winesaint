import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

// ── Wine Saint Certified — extracted collections ──
import { Users } from './payload/collections/Users.ts'
import {
  Lessons,
  Exercises,
  UserProgress,
  Exams,
  ExamAttempts,
  Certificates,
} from './payload/collections/learn/index.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Use Vercel Blob in production, local storage in development
const isProduction = process.env.NODE_ENV === 'production' && process.env.BLOB_READ_WRITE_TOKEN

// ============ COLLECTIONS ============
// (Users is now extracted to ./payload/collections/Users.ts — extended for
// Wine Saint Certified v1 with anonymous learner support.)

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
    { name: 'description', type: 'textarea', maxLength: 500000 },
    { name: 'content', type: 'richText' },
    { name: 'sidebarTitle', type: 'text' },
    {
      name: 'sidebarLinks',
      type: 'array',
      admin: { description: 'Explicit list of links to show in sidebar (overrides child query)' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        { name: 'classification', type: 'text' },
      ],
    },
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
    { name: 'isEssential', type: 'checkbox', defaultValue: false },
    { name: 'berryColor', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'textarea' },
    {
      name: 'aliases',
      type: 'array',
      fields: [{ name: 'alias', type: 'text' }],
    },
    {
      name: 'flavorProfile',
      type: 'array',
      fields: [{ name: 'flavor', type: 'text' }],
    },
    {
      name: 'majorRegions',
      type: 'array',
      fields: [{ name: 'region', type: 'text' }],
    },
    { name: 'primaryRegions', type: 'relationship', relationTo: 'regions', hasMany: true },
    { name: 'history', type: 'richText' },
    { name: 'viticulture', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

const Glossary: CollectionConfig = {
  slug: 'glossary',
  admin: { useAsTitle: 'term' },
  access: { read: () => true },
  fields: [
    { name: 'term', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'definition', type: 'textarea', required: true },
    { name: 'category', type: 'text' },
    { name: 'pronunciation', type: 'text' },
    { name: 'etymology', type: 'text' },
    {
      name: 'relatedTerms',
      type: 'array',
      fields: [{ name: 'term', type: 'text' }],
    },
  ],
}

const OakResources: CollectionConfig = {
  slug: 'oak-resources',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Forest', value: 'forest' },
        { label: 'Species', value: 'species' },
        { label: 'Cooperage', value: 'cooperage' },
        { label: 'Toast Level', value: 'toast' },
        { label: 'Barrel Format', value: 'format' },
        { label: 'Tradition', value: 'tradition' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'textarea' },
    { name: 'country', type: 'text' },
    { name: 'region', type: 'text' },
    { name: 'characteristics', type: 'textarea' },
  ],
}

const RootstockResources: CollectionConfig = {
  slug: 'rootstock-resources',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Variety', value: 'variety' },
        { label: 'Species', value: 'species' },
        { label: 'Region', value: 'region' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'content', type: 'textarea' },
    { name: 'parentage', type: 'text' },
    { name: 'characteristics', type: 'textarea' },
    { name: 'soilAdaptation', type: 'text' },
    { name: 'droughtTolerance', type: 'text' },
    { name: 'vigor', type: 'text' },
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
    { name: 'name', type: 'text', required: false },
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
    Glossary,
    OakResources,
    RootstockResources,
    // ── Wine Saint Certified ──
    Lessons,
    Exercises,
    UserProgress,
    Exams,
    ExamAttempts,
    Certificates,
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
    push: true,
  }),
  // Cloud storage for production deployments (Vercel Blob)
  ...(isProduction && {
    plugins: [
      vercelBlobStorage({
        collections: {
          media: true, // Enable for media collection
        },
        token: process.env.BLOB_READ_WRITE_TOKEN || '',
      }),
    ],
  }),
})
