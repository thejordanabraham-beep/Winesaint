/**
 * Index Payload data into Typesense
 *
 * Run with: npx tsx scripts/index-typesense.ts
 *
 * Required env vars:
 *   TYPESENSE_HOST
 *   TYPESENSE_PORT
 *   TYPESENSE_PROTOCOL
 *   TYPESENSE_API_KEY
 */

import dotenv from 'dotenv';
import path from 'path';
import Typesense from 'typesense';

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const PAYLOAD_API = 'http://localhost:3000/api';

const client = new Typesense.Client({
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

const REGIONS_SCHEMA = {
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
};

async function fetchAllRegions(): Promise<any[]> {
  const allRegions: any[] = [];
  let page = 1;
  let hasMore = true;

  console.log('Fetching regions from Payload...');

  while (hasMore) {
    const response = await fetch(
      `${PAYLOAD_API}/regions?limit=100&page=${page}&depth=1`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch regions: ${response.statusText}`);
    }

    const data = await response.json();
    allRegions.push(...data.docs);

    console.log(`  Fetched page ${page}: ${data.docs.length} regions`);

    hasMore = data.hasNextPage;
    page++;
  }

  console.log(`Total regions fetched: ${allRegions.length}\n`);
  return allRegions;
}

async function createOrUpdateCollection() {
  try {
    // Try to delete existing collection
    await client.collections('regions').delete();
    console.log('Deleted existing regions collection');
  } catch {
    // Collection doesn't exist, that's fine
  }

  // Create new collection
  await client.collections().create(REGIONS_SCHEMA);
  console.log('Created regions collection\n');
}

async function indexRegions(regions: any[]) {
  console.log('Indexing regions into Typesense...');

  // Transform to Typesense documents - ensure all fields are proper types
  const documents = regions.map((region) => {
    const doc: any = {
      id: String(region.id),
      name: String(region.name || ''),
      slug: String(region.slug || ''),
      fullSlug: String(region.fullSlug || ''),
      level: String(region.level || 'region'),
      country: String(region.country || ''),
    };

    // Only add optional fields if they have values
    if (region.classification) {
      doc.classification = String(region.classification);
    }
    if (region.description) {
      doc.description = String(region.description).substring(0, 500);
    }
    if (typeof region.parentRegion === 'object' && region.parentRegion?.name) {
      doc.parentRegionName = String(region.parentRegion.name);
    }

    return doc;
  });

  // Import in batches
  const batchSize = 100;
  let indexed = 0;

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);

    try {
      const result = await client.collections('regions').documents().import(batch, {
        action: 'upsert',
      });

      // Count successful imports
      const successful = result.filter((r: any) => r.success).length;
      indexed += successful;

      if (successful < batch.length) {
        const failed = result.filter((r: any) => !r.success);
        console.log(`  Batch: ${successful}/${batch.length} succeeded`);
        if (failed.length > 0) {
          console.log(`  First error: ${JSON.stringify(failed[0])}`);
        }
      } else {
        console.log(`  Indexed ${indexed}/${documents.length} regions`);
      }
    } catch (error: any) {
      console.error(`Error indexing batch: ${error.message}`);
      if (error.importResults) {
        const failed = error.importResults.filter((r: any) => !r.success);
        if (failed.length > 0) {
          console.log(`  First error detail: ${JSON.stringify(failed[0])}`);
        }
      }
    }
  }

  console.log(`\nIndexing complete: ${indexed} regions indexed`);
}

async function main() {
  console.log('Typesense Indexing Script\n');
  console.log(`Host: ${process.env.TYPESENSE_HOST}`);
  console.log(`Port: ${process.env.TYPESENSE_PORT}`);
  console.log(`Protocol: ${process.env.TYPESENSE_PROTOCOL}\n`);

  if (!process.env.TYPESENSE_API_KEY) {
    console.error('Error: TYPESENSE_API_KEY not set');
    console.log('\nTo use Typesense:');
    console.log('1. Sign up at https://cloud.typesense.org');
    console.log('2. Create a cluster');
    console.log('3. Add these env vars to .env.local:');
    console.log('   TYPESENSE_HOST=xxx.typesense.net');
    console.log('   TYPESENSE_PORT=443');
    console.log('   TYPESENSE_PROTOCOL=https');
    console.log('   TYPESENSE_API_KEY=your-admin-api-key');
    console.log('   TYPESENSE_SEARCH_ONLY_API_KEY=your-search-only-key');
    process.exit(1);
  }

  try {
    // Test connection
    const health = await client.health.retrieve();
    console.log('Typesense connection OK:', health);
  } catch (error: any) {
    console.error('Failed to connect to Typesense:', error.message);
    process.exit(1);
  }

  const regions = await fetchAllRegions();
  await createOrUpdateCollection();
  await indexRegions(regions);

  console.log('\nDone!');
}

main().catch(console.error);
