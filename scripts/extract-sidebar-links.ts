/**
 * Extract sidebarLinks from backup page files and update region-configs.json
 *
 * Run with: npx tsx scripts/extract-sidebar-links.ts
 */

import fs from 'fs';
import path from 'path';

const BACKUP_DIR = path.join(process.cwd(), 'regions-pages-backup');
const CONFIG_PATH = path.join(process.cwd(), 'app/data/region-configs.json');

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

// Extract sidebarLinks from a page.tsx file
function extractSidebarLinks(content: string): SidebarLink[] | null {
  // Look for const arrays that look like sidebar links
  // Patterns to match:
  // const SOMETHING = [ { name: '...', slug: '...', classification?: '...' }, ... ]

  const arrayPatterns = [
    // Match: const NAME = [ ... ] with objects containing name/slug
    /const\s+\w+\s*=\s*\[\s*((?:\{[^}]+\}\s*,?\s*)+)\]/gs,
    // Match: sidebarLinks={CONSTANT}
    /sidebarLinks=\{(\w+)\}/g,
  ];

  // Find variable assignments that look like sidebar link arrays
  const varMatch = content.match(/const\s+(\w+)\s*=\s*\[/g);
  if (!varMatch) return null;

  for (const match of varMatch) {
    const varName = match.match(/const\s+(\w+)/)?.[1];
    if (!varName) continue;

    // Skip if it doesn't look like a sidebar links array
    if (!varName.includes('VINEYARD') &&
        !varName.includes('SUB') &&
        !varName.includes('REGION') &&
        !varName.includes('VILLAGE') &&
        !varName.includes('LINK') &&
        !varName.includes('MGA') &&
        !varName.includes('CRUS') &&
        !varName.includes('LAGE') &&
        !varName.includes('LAGEN')) {
      continue;
    }

    // Extract the full array content
    const arrayStart = content.indexOf(`const ${varName}`);
    if (arrayStart === -1) continue;

    // Find matching bracket
    let bracketCount = 0;
    let arrayEnd = -1;
    let inArray = false;

    for (let i = arrayStart; i < content.length; i++) {
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

    const arrayContent = content.slice(arrayStart, arrayEnd);

    // Parse objects from the array
    // Support both quoted keys ("name":) and unquoted keys (name:)
    const links: SidebarLink[] = [];
    const objectRegex = /\{\s*"?name"?:\s*['"]([^'"]+)['"]\s*,\s*"?slug"?:\s*['"]([^'"]+)['"](?:\s*,\s*"?classification"?:\s*['"]([^'"]+)['"])?(?:\s*,\s*"?description"?:\s*['"]([^'"]+)['"])?[^}]*\}/g;

    let objMatch;
    while ((objMatch = objectRegex.exec(arrayContent)) !== null) {
      const link: SidebarLink = {
        name: objMatch[1],
        slug: objMatch[2],
      };
      if (objMatch[3]) {
        link.classification = objMatch[3].replace(' as const', '');
      }
      if (objMatch[4]) {
        link.description = objMatch[4];
      }
      links.push(link);
    }

    if (links.length > 0) {
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

  function processDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name === 'page.tsx') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const links = extractSidebarLinks(content);

        if (links && links.length > 0) {
          const fullSlug = pathToFullSlug(path.dirname(fullPath));

          if (configs[fullSlug]) {
            // Only update if no sidebarLinks exist or they're empty
            if (!configs[fullSlug].sidebarLinks || configs[fullSlug].sidebarLinks.length === 0) {
              configs[fullSlug].sidebarLinks = links;
              updated++;
              console.log(`Updated: ${fullSlug} (${links.length} links)`);
            } else {
              skipped++;
            }
          } else {
            console.log(`Config not found for: ${fullSlug}`);
          }
        }
      }
    }
  }

  processDirectory(BACKUP_DIR);

  // Write updated config
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf-8');

  console.log(`\nDone! Updated ${updated} configs, skipped ${skipped} (already had links)`);
}

processBackupPages().catch(console.error);
