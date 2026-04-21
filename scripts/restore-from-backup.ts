/**
 * RESTORE ALL SIDEBAR DATA FROM BACKUP PAGES
 * This will make the site look exactly like it did before deployment
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

// Parse ANY array that contains objects with name/slug
function extractLinksFromContent(content: string): { varName: string; links: SidebarLink[] } | null {
  // Find all const declarations with arrays
  const regex = /const\s+([A-Z_][A-Z0-9_]*)\s*=\s*\[/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const varName = match[1];
    const startIdx = match.index;

    // Find the closing bracket
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '[') depth++;
      if (content[i] === ']') {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }

    if (endIdx === -1) continue;

    const arrayStr = content.slice(startIdx, endIdx);

    // Check if it has name and slug
    if (!arrayStr.includes('name') || !arrayStr.includes('slug')) continue;

    // Parse the objects
    const links: SidebarLink[] = [];
    // Match objects with name and slug (handles both quoted and unquoted keys)
    const objRegex = /\{\s*"?name"?\s*:\s*['"]([^'"]+)['"]\s*,\s*"?slug"?\s*:\s*['"]([^'"]+)['"](?:\s*,\s*"?classification"?\s*:\s*['"]([^'"]+)['"])?[^}]*\}/g;

    let objMatch;
    while ((objMatch = objRegex.exec(arrayStr)) !== null) {
      const link: SidebarLink = {
        name: objMatch[1],
        slug: objMatch[2],
      };
      if (objMatch[3]) {
        link.classification = objMatch[3].replace(/ as const/g, '').trim();
      }
      links.push(link);
    }

    if (links.length > 0) {
      return { varName, links };
    }
  }

  return null;
}

// Get sidebarTitle from the backup page if it exists
function extractSidebarTitle(content: string): string | undefined {
  const match = content.match(/sidebarTitle\s*[=:]\s*['"]([^'"]+)['"]/);
  return match ? match[1] : undefined;
}

// Get classification from backup page
function extractClassification(content: string): string | undefined {
  const match = content.match(/classification\s*[=:]\s*['"]([^'"]+)['"]/);
  return match ? match[1] : undefined;
}

async function main() {
  const configs: Record<string, RegionConfig> = JSON.parse(
    fs.readFileSync(CONFIG_PATH, 'utf-8')
  );

  let updated = 0;
  let alreadyHad = 0;
  let noData = 0;

  function processDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (entry.name === 'page.tsx') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const relativePath = path.relative(BACKUP_DIR, path.dirname(fullPath));
        const fullSlug = relativePath.replace(/\\/g, '/');

        if (!configs[fullSlug]) {
          continue;
        }

        // Extract sidebar links
        const extracted = extractLinksFromContent(content);

        if (extracted && extracted.links.length > 0) {
          // ALWAYS update - we want to restore from backup
          if (!configs[fullSlug].sidebarLinks || configs[fullSlug].sidebarLinks!.length === 0) {
            configs[fullSlug].sidebarLinks = extracted.links;
            updated++;
            console.log(`✓ ${fullSlug}: ${extracted.links.length} links from ${extracted.varName}`);
          } else {
            alreadyHad++;
          }
        } else {
          noData++;
        }

        // Extract sidebarTitle if present
        const sidebarTitle = extractSidebarTitle(content);
        if (sidebarTitle && !configs[fullSlug].sidebarTitle) {
          configs[fullSlug].sidebarTitle = sidebarTitle;
        }

        // Extract classification if present (for vineyards)
        const classification = extractClassification(content);
        if (classification && !configs[fullSlug].classification) {
          configs[fullSlug].classification = classification;
        }
      }
    }
  }

  processDir(BACKUP_DIR);

  // Save
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(configs, null, 2), 'utf-8');

  console.log('\n========================================');
  console.log('RESTORATION COMPLETE');
  console.log('========================================');
  console.log(`Updated: ${updated}`);
  console.log(`Already had data: ${alreadyHad}`);
  console.log(`No sidebar data in backup: ${noData}`);

  // Summary by level
  console.log('\n--- CURRENT STATE ---');
  const levels = ['country', 'region', 'subregion', 'sub-region', 'village', 'vineyard'];
  for (const level of levels) {
    const pages = Object.entries(configs).filter(([_, c]) => c.level === level);
    const withSidebar = pages.filter(([_, c]) => c.sidebarLinks && c.sidebarLinks.length > 0);
    if (pages.length > 0) {
      console.log(`${level}: ${withSidebar.length}/${pages.length} have sidebarLinks`);
    }
  }
}

main().catch(console.error);
