/**
 * Typesense search client configuration
 *
 * To use Typesense:
 * 1. Sign up at https://cloud.typesense.org (free tier available)
 * 2. Create a cluster
 * 3. Add these env vars to .env.local:
 *    TYPESENSE_HOST=xxx.typesense.net
 *    TYPESENSE_PORT=443
 *    TYPESENSE_PROTOCOL=https
 *    TYPESENSE_API_KEY=your-api-key
 *    TYPESENSE_SEARCH_ONLY_API_KEY=your-search-only-key
 */

import Typesense from 'typesense';

// Admin client (for indexing)
export function getTypesenseAdmin() {
  return new Typesense.Client({
    nodes: [
      {
        host: process.env.TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.TYPESENSE_PORT || '8108'),
        protocol: process.env.TYPESENSE_PROTOCOL || 'http',
      },
    ],
    apiKey: process.env.TYPESENSE_API_KEY || '',
    connectionTimeoutSeconds: 10,
  });
}

// Search client (read-only, safe for client-side)
export function getTypesenseSearch() {
  return new Typesense.Client({
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || process.env.TYPESENSE_HOST || 'localhost',
        port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || process.env.TYPESENSE_PORT || '8108'),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || process.env.TYPESENSE_PROTOCOL || 'http',
      },
    ],
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY || process.env.TYPESENSE_SEARCH_ONLY_API_KEY || '',
    connectionTimeoutSeconds: 5,
  });
}

// Collection schemas
export const REGIONS_SCHEMA = {
  name: 'regions',
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'name', type: 'string' as const },
    { name: 'slug', type: 'string' as const },
    { name: 'fullSlug', type: 'string' as const },
    { name: 'level', type: 'string' as const, facet: true },
    { name: 'country', type: 'string' as const, facet: true },
    { name: 'classification', type: 'string' as const, facet: true, optional: true },
    { name: 'description', type: 'string' as const, optional: true },
    { name: 'parentRegionName', type: 'string' as const, optional: true },
  ],
  default_sorting_field: 'name' as const,
};

export const WINES_SCHEMA = {
  name: 'wines',
  fields: [
    { name: 'id', type: 'string' as const },
    { name: 'name', type: 'string' as const },
    { name: 'slug', type: 'string' as const },
    { name: 'vintage', type: 'int32' as const, facet: true },
    { name: 'wineType', type: 'string' as const, facet: true, optional: true },
    { name: 'producer', type: 'string' as const, optional: true },
    { name: 'region', type: 'string' as const, optional: true },
    { name: 'country', type: 'string' as const, facet: true, optional: true },
    { name: 'grapes', type: 'string[]' as const, facet: true, optional: true },
    { name: 'priceRange', type: 'string' as const, facet: true, optional: true },
  ],
  default_sorting_field: 'vintage' as const,
};

// Search function
export async function searchRegions(query: string, options?: {
  limit?: number;
  filterBy?: string;
  facetBy?: string[];
}) {
  const client = getTypesenseSearch();

  try {
    const result = await client.collections('regions').documents().search({
      q: query,
      query_by: 'name,country,description',
      per_page: options?.limit || 20,
      filter_by: options?.filterBy,
      facet_by: options?.facetBy?.join(','),
    });

    return result;
  } catch (error) {
    console.error('Typesense search error:', error);
    return null;
  }
}

export async function searchWines(query: string, options?: {
  limit?: number;
  filterBy?: string;
  facetBy?: string[];
}) {
  const client = getTypesenseSearch();

  try {
    const result = await client.collections('wines').documents().search({
      q: query,
      query_by: 'name,producer,region,grapes',
      per_page: options?.limit || 20,
      filter_by: options?.filterBy,
      facet_by: options?.facetBy?.join(','),
    });

    return result;
  } catch (error) {
    console.error('Typesense search error:', error);
    return null;
  }
}

// Multi-collection search
export async function searchAll(query: string, limit = 10) {
  const client = getTypesenseSearch();

  try {
    const result = await client.multiSearch.perform({
      searches: [
        {
          collection: 'regions',
          q: query,
          query_by: 'name,country,description',
          per_page: limit,
        },
        {
          collection: 'wines',
          q: query,
          query_by: 'name,producer,region',
          per_page: limit,
        },
      ],
    });

    return result;
  } catch (error) {
    console.error('Typesense multi-search error:', error);
    return null;
  }
}
