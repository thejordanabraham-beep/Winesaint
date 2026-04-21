/**
 * Extract sidebarLinks from ALL backup pages at ALL levels
 * Run with: npx tsx scripts/extract-all-levels.ts
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

// Extract ALL arrays with name/slug objects from a page.tsx file
function extractAllSidebarLinks(content: string): SidebarLink[] | null {
  // Find ALL const array declarations
  const matches = [...content.matchAll(/const\s+(\w+)\s*=\s*\[/g)];

  for (const match of matches) {
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

    // Skip if it's clearly not sidebar data (e.g., producers array)
    if (varName.toLowerCase().includes('producer')) {
      continue;
    }

    // Parse objects from the array
    const links: SidebarLink[] = [];
    const objectRegex = /\{\s*"?name"?\s*:\s*['"]([^'"]+)['"]\s*,\s*"?slug"?\s*:\s*['"]([^'"]+)['"](?:\s*,\s*"?classification"?\s*:\s*['"]([^'"]+)['"])?(?:\s*,\s*"?description"?\s*:\s*['"]([^'"]+)['"])?[^}]*\}/g;

    let objMatch;
    while ((objMatch = objectRegex.exec(arrayContent)) !== null) {
      const link: SidebarLink = {
        name: objMatch[1],
        slug: objMatch[2],
      };
      if (objMatch[3]) {
        link.classification = objMatch[3].replace(' as const', '').trim();
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

function pathToFullSlug(dirPath: string): string {
  const relativePath = path.relative(BACKUP_DIR, dirPath);
  return relativePath.replace(/\\/g, '/');
}

async function processBackupPages() {
  const configs: Record<string, RegionConfig> = JSON.parse(
    fs.readFileSync(CONFIG_PATH, 'utf-8')
  );

  const stats = {
    country: { updated: 0, skipped: 0, noLinks: 0 },
    region: { updated: 0, skipped: 0, noLinks: 0 },
    subregion: { updated: 0, skipped: 0, noLinks: 0 },
    village: { updated: 0, skipped: 0, noLinks: 0 },
    vineyard: { updated: 0, skipped: 0, noLinks: 0 },
  };

  function processDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name === 'page.tsx') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const fullSlug = pathToFullSlug(path.dirname(fullPath));
        const config = configs[fullSlug];

        if (!config) continue;

        const level = config.level === 'sub-region' ? 'subregion' : config.level;
        const levelStats = stats[level as keyof typeof stats];
        if (!levelStats) continue;

        const links = extractAllSidebarLinks(content);

        if (links && links.length > 0) {
          if (!config.sidebarLinks || config.sidebarLinks.length === 0) {
            configs[fullSlug].sidebarLinks = links;
            levelStats.updated++;
            console.log(`✓ ${level.toUpperCase()}: ${fullSlug} (${links.length} links)`);
          } else {
            levelStats.skipped++;
          }
        } else {
          levelStats.noLinks++;
        }
      }
    }
  }

  processDirectory(BACKUP_DIR);

  // Write updated config
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log('EXTRACTION SUMMARY BY LEVEL');
  console.log('='.repeat(60));

  for (const [level, levelStats] of Object.entries(stats)) {
    console.log(`\n${level.toUpperCase()}:`);
    console.log(`  Updated: ${levelStats.updated}`);
    console.log(`  Skipped (already had): ${levelStats.skipped}`);
    console.log(`  No links in backup: ${levelStats.noLinks}`);
  }
}

processBackupPages().catch(console.error);
