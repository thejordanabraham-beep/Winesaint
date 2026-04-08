import { MetadataRoute } from 'next';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const BASE_URL = 'https://winesaint.com';

// Recursively find all page.tsx files in a directory
function findPageRoutes(dir: string, baseDir: string): string[] {
  const routes: string[] = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        // Skip special Next.js directories and node_modules
        if (!item.name.startsWith('_') && !item.name.startsWith('.') && item.name !== 'node_modules') {
          routes.push(...findPageRoutes(fullPath, baseDir));
        }
      } else if (item.name === 'page.tsx') {
        // Convert file path to URL path
        const relativePath = path.relative(baseDir, dir);
        const urlPath = relativePath
          .split(path.sep)
          .filter(segment => !segment.startsWith('[') && !segment.startsWith('('))
          .join('/');

        routes.push(urlPath || '');
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // 1. Static pages
  sitemap.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  sitemap.push({
    url: `${BASE_URL}/wines`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  });

  sitemap.push({
    url: `${BASE_URL}/articles`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  sitemap.push({
    url: `${BASE_URL}/vintages`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  });

  // 2. All region pages
  const appDir = path.join(process.cwd(), 'app');
  const regionsDir = path.join(appDir, 'regions');

  if (fs.existsSync(regionsDir)) {
    const regionRoutes = findPageRoutes(regionsDir, regionsDir);

    for (const route of regionRoutes) {
      sitemap.push({
        url: `${BASE_URL}/regions/${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  // 3. Wine review pages from Sanity
  try {
    const wines = await client.fetch<Array<{ slug: string; _updatedAt: string }>>(`
      *[_type == 'review' && defined(wine->slug.current)] {
        'slug': wine->slug.current,
        _updatedAt
      }
    `);

    for (const wine of wines) {
      sitemap.push({
        url: `${BASE_URL}/wines/${wine.slug}`,
        lastModified: new Date(wine._updatedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  } catch (error) {
    console.error('Error fetching wine reviews for sitemap:', error);
  }

  return sitemap;
}
