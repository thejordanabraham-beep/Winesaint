/**
 * Migrate all file-based region pages to Sanity CMS
 *
 * This script:
 * 1. Reads all app/regions/**/page.tsx files
 * 2. Extracts region data (title, level, parent, sidebar links)
 * 3. Reads corresponding markdown guide files
 * 4. Uploads all regions to Sanity
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'hj3ee4sp',
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

interface RegionPageData {
  title: string;
  level: string;
  parentRegion?: string;
  sidebarLinks?: Array<{
    name: string;
    slug: string;
    classification?: string;
  }>;
  contentFile?: string;
}

interface RegionDocument {
  _type: 'region';
  name: string;
  slug: { current: string };
  fullSlug: string;
  level: string;
  country: string;
  parentRegion?: { _type: 'reference'; _ref: string };
  sidebarLinks?: Array<{
    name: string;
    slug: string;
    classification?: string;
  }>;
  content?: any[];
}

// Parse a page.tsx file to extract region data
function parsePageFile(filePath: string): RegionPageData | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract title from RegionLayout component
    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : null;

    // Extract level
    const levelMatch = content.match(/level="([^"]+)"/);
    const level = levelMatch ? levelMatch[1] : 'region';

    // Extract parent region
    const parentMatch = content.match(/parentRegion="([^"]+)"/);
    const parentRegion = parentMatch ? parentMatch[1] : undefined;

    // Extract sidebar links (if any)
    const sidebarLinksMatch = content.match(/const\s+\w+\s*=\s*\[([\s\S]*?)\]\s*as const;/);
    let sidebarLinks: any[] = [];

    if (sidebarLinksMatch) {
      const linksContent = sidebarLinksMatch[1];
      const linkMatches = linksContent.matchAll(/\{\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*classification:\s*'([^']+)'/g);
      for (const match of linkMatches) {
        sidebarLinks.push({
          name: match[1],
          slug: match[2],
          classification: match[3],
        });
      }
    }

    // Extract content file
    const contentFileMatch = content.match(/contentFile="([^"]+)"/);
    const contentFile = contentFileMatch ? contentFileMatch[1] : undefined;

    if (!title) return null;

    return {
      title,
      level,
      parentRegion,
      sidebarLinks: sidebarLinks.length > 0 ? sidebarLinks : undefined,
      contentFile,
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

// Convert file path to full slug
function pathToFullSlug(filePath: string): string {
  const parts = filePath
    .replace(/^app\/regions\//, '')
    .replace(/\/page\.tsx$/, '')
    .split('/');
  return parts.join('/');
}

// Extract country from full slug
function getCountryFromSlug(fullSlug: string): string {
  const parts = fullSlug.split('/');
  // Capitalize first letter of country
  const country = parts[0];
  return country.charAt(0).toUpperCase() + country.slice(1);
}

// Read markdown guide file and convert to Sanity blocks
async function readGuideContent(contentFile: string): Promise<any[] | null> {
  const guidePath = path.join(process.cwd(), 'guides', contentFile);

  if (!fs.existsSync(guidePath)) {
    return null;
  }

  try {
    const markdown = fs.readFileSync(guidePath, 'utf-8');

    // Simple markdown to Sanity blocks conversion
    // Split by paragraphs and convert to block format
    const blocks = markdown
      .split('\n\n')
      .filter(p => p.trim())
      .map((paragraph, index) => {
        // Check if it's a heading
        if (paragraph.startsWith('#')) {
          const level = paragraph.match(/^#+/)?.[0].length || 1;
          const text = paragraph.replace(/^#+\s*/, '');
          return {
            _type: 'block',
            _key: `block-${index}`,
            style: `h${Math.min(level, 6)}`,
            children: [{ _type: 'span', text }],
          };
        }

        // Regular paragraph
        return {
          _type: 'block',
          _key: `block-${index}`,
          style: 'normal',
          children: [{ _type: 'span', text: paragraph }],
        };
      });

    return blocks;
  } catch (error) {
    console.error(`Error reading guide ${guidePath}:`, error);
    return null;
  }
}

// Main migration function
async function migrateRegions() {
  console.log('🚀 Starting region migration to Sanity...\n');

  // Find all page.tsx files in app/regions
  const pageFiles = await glob('app/regions/**/page.tsx', {
    cwd: process.cwd(),
  });

  console.log(`📁 Found ${pageFiles.length} region page files\n`);

  // Parse all pages first to build parent reference map
  const regionMap = new Map<string, { data: RegionPageData; fullSlug: string }>();

  for (const filePath of pageFiles) {
    const fullSlug = pathToFullSlug(filePath);
    const data = parsePageFile(filePath);

    if (data) {
      regionMap.set(fullSlug, { data, fullSlug });
    }
  }

  console.log(`✅ Parsed ${regionMap.size} regions\n`);

  // Track uploaded regions and their Sanity IDs
  const uploadedRegions = new Map<string, string>();

  let successCount = 0;
  let errorCount = 0;

  // Upload regions in order (parents before children)
  // Sort by path depth
  const sortedRegions = Array.from(regionMap.entries()).sort((a, b) => {
    return a[0].split('/').length - b[0].split('/').length;
  });

  for (const [fullSlug, { data }] of sortedRegions) {
    try {
      console.log(`📝 Processing: ${fullSlug}`);

      // Get slug (last part of path)
      const slug = fullSlug.split('/').pop() || fullSlug;
      const country = getCountryFromSlug(fullSlug);

      // Find parent region reference
      let parentRef = undefined;
      if (data.parentRegion) {
        const parentId = uploadedRegions.get(data.parentRegion);
        if (parentId) {
          parentRef = {
            _type: 'reference' as const,
            _ref: parentId,
          };
        }
      }

      // Read guide content if specified
      let content = null;
      if (data.contentFile) {
        content = await readGuideContent(data.contentFile);
      }

      // Create Sanity document
      const doc: RegionDocument = {
        _type: 'region',
        name: data.title,
        slug: { current: slug },
        fullSlug,
        level: data.level,
        country,
        ...(parentRef && { parentRegion: parentRef }),
        ...(data.sidebarLinks && { sidebarLinks: data.sidebarLinks }),
        ...(content && { content }),
      };

      // Upload to Sanity
      const result = await client.create(doc);
      uploadedRegions.set(fullSlug, result._id);

      successCount++;
      console.log(`   ✅ Created: ${result._id}`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      errorCount++;
      console.error(`   ❌ Error: ${error}`);
    }
  }

  console.log('\n📊 Migration Complete!');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📍 Total: ${regionMap.size}`);
}

// Run migration
migrateRegions().catch(console.error);
