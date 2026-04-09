import fs from 'fs';
import path from 'path';

interface SidebarLink {
  name: string;
  slug: string;
  classification?: string;
}

interface PageConfig {
  title: string;
  level: string;
  parentRegion?: string;
  contentFile: string;
  sidebarLinks?: SidebarLink[];
  sidebarTitle?: string;
}

const regionsDir = path.join(process.cwd(), 'app/regions');
const outputFile = path.join(process.cwd(), 'app/data/region-configs.json');

const configs: Record<string, PageConfig> = {};

function extractConfig(filePath: string, relativePath: string): PageConfig | null {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Try multiple extraction patterns

  // Pattern 1: Standard RegionLayout usage
  // title="France" or title: "France"
  let titleMatch = content.match(/title[=:]\s*["']([^"']+)["']/);

  // Pattern 2: Page component with h1
  if (!titleMatch) {
    titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  }

  // Pattern 3: Variable assignment like FRANCE_SUB_REGIONS suggests France
  if (!titleMatch) {
    const constMatch = content.match(/const\s+([A-Z_]+)_(?:SUB_REGIONS|MAJOR_REGIONS)/);
    if (constMatch) {
      // Convert FRANCE to France, SOUTH_AFRICA to South Africa
      const name = constMatch[1].split('_').map(w =>
        w.charAt(0) + w.slice(1).toLowerCase()
      ).join(' ');
      titleMatch = [null, name] as unknown as RegExpMatchArray;
    }
  }

  if (!titleMatch) return null;
  const title = titleMatch[1];

  // Extract level
  let levelMatch = content.match(/level[=:]\s*["']([^"']+)["']/);

  // Infer level from path depth if not explicit
  let level = 'region';
  if (levelMatch) {
    level = levelMatch[1];
  } else {
    const depth = relativePath.split('/').length;
    if (depth === 1) level = 'country';
    else if (depth === 2) level = 'region';
    else if (depth === 3) level = 'sub-region';
    else level = 'village';
  }

  // Extract parentRegion
  const parentMatch = content.match(/parentRegion[=:]\s*["']([^"']+)["']/);
  let parentRegion = parentMatch ? parentMatch[1] : undefined;

  // Infer parentRegion from path if not explicit
  if (!parentRegion && relativePath.includes('/')) {
    const parts = relativePath.split('/');
    parts.pop();
    parentRegion = parts.join('/');
  }

  // Extract contentFile
  let contentFileMatch = content.match(/contentFile[=:]\s*["']([^"']+)["']/);
  let contentFile: string;

  if (contentFileMatch) {
    contentFile = contentFileMatch[1];
  } else {
    // Try to find markdown file reference
    const mdMatch = content.match(/['"]([a-z0-9-]+-guide\.md)['"]/);
    if (mdMatch) {
      contentFile = mdMatch[1];
    } else {
      // Generate from slug
      const slug = relativePath.split('/').pop() || relativePath;
      contentFile = `${slug}-guide.md`;
    }
  }

  // Extract sidebarTitle
  const sidebarTitleMatch = content.match(/sidebarTitle[=:]\s*["']([^"']+)["']/);

  // Extract sidebarLinks array - try multiple patterns
  let sidebarLinks: SidebarLink[] | undefined;

  // Pattern 1: const SOMETHING_REGIONS = [...]
  const arrayMatch = content.match(/const\s+\w+\s*=\s*\[([\s\S]*?)\](?:\s*as\s*const)?;/);
  if (arrayMatch) {
    const arrayContent = arrayMatch[1];

    // Match objects with name and slug
    const linkMatches = arrayContent.matchAll(/\{\s*name:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"](?:,\s*(?:type|classification):\s*['"]([^'"]+)['"])?\s*\}/g);

    sidebarLinks = [];
    for (const match of linkMatches) {
      const link: SidebarLink = { name: match[1], slug: match[2] };
      if (match[3]) link.classification = match[3];
      sidebarLinks.push(link);
    }

    if (sidebarLinks.length === 0) sidebarLinks = undefined;
  }

  // Pattern 2: sidebarLinks={[...]} inline
  if (!sidebarLinks) {
    const inlineMatch = content.match(/sidebarLinks=\{\[([\s\S]*?)\]\}/);
    if (inlineMatch) {
      const arrayContent = inlineMatch[1];
      const linkMatches = arrayContent.matchAll(/\{\s*name:\s*['"]([^'"]+)['"],\s*slug:\s*['"]([^'"]+)['"]\s*\}/g);

      sidebarLinks = [];
      for (const match of linkMatches) {
        sidebarLinks.push({ name: match[1], slug: match[2] });
      }

      if (sidebarLinks.length === 0) sidebarLinks = undefined;
    }
  }

  const config: PageConfig = {
    title,
    level,
    contentFile,
  };

  if (parentRegion) config.parentRegion = parentRegion;
  if (sidebarLinks && sidebarLinks.length > 0) config.sidebarLinks = sidebarLinks;
  if (sidebarTitleMatch) config.sidebarTitle = sidebarTitleMatch[1];

  return config;
}

function walkDir(dir: string, basePath: string = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip catch-all directories
      if (entry.name.startsWith('[...')) continue;

      const newBasePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      walkDir(fullPath, newBasePath);
    } else if (entry.name === 'page.tsx' && basePath) {
      const config = extractConfig(fullPath, basePath);
      if (config) {
        configs[basePath] = config;
        console.log(`Extracted: ${basePath}`);
      } else {
        console.warn(`Failed to extract: ${fullPath}`);
      }
    }
  }
}

// Start extraction
walkDir(regionsDir);

// Write output
fs.writeFileSync(outputFile, JSON.stringify(configs, null, 2));

console.log(`\nExtracted ${Object.keys(configs).length} configs to ${outputFile}`);
