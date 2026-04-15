/**
 * Comprehensive extraction of ALL sidebar links from backup pages
 * This script is more aggressive and captures ALL arrays with name/slug objects
 *
 * Run with: npx tsx scripts/comprehensive-extract.ts
 */

import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'regions-pages-backup');
const CONFIG_PATH = path.join(process.cwd(), 'app/(main)/data/region-configs.json');

interface SidebarLink {
  name: string;
  slug: string;
  classification?: string;
  description?: string;
}

interface RegionConfig {
  title: string;
  level: string;
  contentFile?: string;
  parentRegion?: string;
  sidebarLinks?: SidebarLink[];
  sidebarTitle?: string;
  classification?: string;
}

// Extract ALL arrays with name/slug objects from a page.tsx file
function extractAllSidebarLinks(content: string): SidebarLink[] | null {
  // Find ALL const array declarations
  const constMatches = content.matchAll(/const\s+(\w+)\s*=\s*\[/g);

  for (const match of constMatches) {
    const varName = match[1];
    const startIndex = match.index!;

    // Find the matching closing bracket
    let bracketCount = 0;
    let inArray = false;
    let arrayEnd = -1;

    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '[') {
        bracketCount++;
        inArray = true;
      } else if (content[i] === ']') {
        bracketCount--;
        if (inArray && bracketCount === 0) {
          arrayEnd = i + 1;
          break;
        }
      }
    }

    if (arrayEnd === -1) continue;

    const arrayContent = content.slice(startIndex, arrayEnd);

    // Check if this array contains objects with name and slug properties
    if (!arrayContent.includes('name') || !arrayContent.includes('slug')) {
      continue;
    }

    // Parse objects from the array - handle both quoted and unquoted keys
    const links: SidebarLink[] = [];

    // Regex that handles multiple formats:
    // { name: "...", slug: "...", classification?: "..." }
    // { "name": "...", "slug": "...", "classification"?: "..." }
    const objectRegex = /\{\s*"?name"?\s*:\s*['"]([^'"]+)['"]\s*,\s*"?slug"?\s*:\s*['"]([^'"]+)['"](?:\s*,\s*"?classification"?\s*:\s*['"]([^'"]+)['"])?(?:\s*,\s*"?description"?\s*:\s*['"]([^'"]+)['"])?[^}]*\}/g;

    let objMatch;
    while ((objMatch = objectRegex.exec(arrayContent)) !== null) {
      const link: SidebarLink = {
        name: objMatch[1],
        slug: objMatch[2],
      };
      if (objMatch[3]) {
        // Clean up classification value
        link.classification = objMatch[3].replace(' as const', '').trim();
      }
      if (objMatch[4]) {
        link.description = objMatch[4];
      }
      links.push(link);
    }

    if (links.length > 0) {
      console.log(`  Found ${links.length} links in ${varName}`);
      return links;
    }
  }

  return null;
}

// Generate fullSlug from directory path
function pathToFullSlug(dirPath: string): string {
  const relativePath = path.relative(BACKUP_DIR, dirPath);
  return relativePath.replace(/\\/g, '/');
}

// Process all backup pages
async function processBackupPages() {
  const configs: Record<string, RegionConfig> = JSON.parse(
    fs.readFileSync(CONFIG_PATH, 'utf-8')
  );

  let updated = 0;
  let skipped = 0;
  let notFound = 0;
  let noLinks = 0;

  const missing: string[] = [];
  const foundButNoConfig: string[] = [];

  function processDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name === 'page.tsx') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const fullSlug = pathToFullSlug(path.dirname(fullPath));

        console.log(`Processing: ${fullSlug}`);
        const links = extractAllSidebarLinks(content);

        if (links && links.length > 0) {
          if (configs[fullSlug]) {
            // Only update if no sidebarLinks exist or they're empty
            if (!configs[fullSlug].sidebarLinks || configs[fullSlug].sidebarLinks!.length === 0) {
              configs[fullSlug].sidebarLinks = links;
              updated++;
              console.log(`  ✓ Updated: ${fullSlug} (${links.length} links)`);
            } else {
              skipped++;
              console.log(`  - Skipped: ${fullSlug} (already has ${configs[fullSlug].sidebarLinks!.length} links)`);
            }
          } else {
            foundButNoConfig.push(fullSlug);
            console.log(`  ✗ Config not found for: ${fullSlug}`);
            notFound++;
          }
        } else {
          noLinks++;
        }
      }
    }
  }

  processDirectory(BACKUP_DIR);

  // Write updated config
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf-8');

  console.log(`\n========== SUMMARY ==========`);
  console.log(`Updated: ${updated} configs`);
  console.log(`Skipped: ${skipped} (already had links)`);
  console.log(`No config found: ${notFound}`);
  console.log(`No links in backup: ${noLinks}`);

  if (foundButNoConfig.length > 0) {
    console.log(`\nPages with links but no config:`);
    foundButNoConfig.forEach(slug => console.log(`  - ${slug}`));
  }

  // Now check which village configs still don't have sidebarLinks
  const villagesMissing: string[] = [];
  for (const [slug, config] of Object.entries(configs)) {
    if (config.level === 'village' && (!config.sidebarLinks || config.sidebarLinks.length === 0)) {
      villagesMissing.push(slug);
    }
  }

  if (villagesMissing.length > 0) {
    console.log(`\n${villagesMissing.length} village configs still missing sidebarLinks:`);
    villagesMissing.slice(0, 20).forEach(slug => console.log(`  - ${slug}`));
    if (villagesMissing.length > 20) {
      console.log(`  ... and ${villagesMissing.length - 20} more`);
    }
  }
}

processBackupPages().catch(console.error);
