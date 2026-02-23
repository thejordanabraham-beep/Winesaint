import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  stega: false,
});

// Client with no caching for boundary/map data that updates frequently
export const freshClient = client.withConfig({
  useCdn: false,
  fetch: { cache: 'no-store' },
});
