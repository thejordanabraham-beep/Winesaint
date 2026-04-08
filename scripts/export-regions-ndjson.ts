// Export all regions to NDJSON format for Sanity import
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

interface RegionData {
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

function parsePageFile(filePath: string): RegionData | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    const titleMatch = content.match(/title="([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : null;

    const levelMatch = content.match(/level="([^"]+)"/);
    const level = levelMatch ? levelMatch[1] : 'region';

    const parentMatch = content.match(/parentRegion="([^"]+)"/);
    const parentRegion = parentMatch ? parentMatch[1] : undefined;

    const contentFileMatch = content.match(/contentFile="([^"]+)"/);
    const contentFile = contentFileMatch ? contentFileMatch[1] : undefined;

    // Parse sidebar links
    let sidebarLinks: any[] = [];
    const linksMatch = content.match(/const\s+\w+\s*=\s*\[([^\]]*)\]\s*as const;/s);
    if (linksMatch) {
      const linksContent = linksMatch[1];
      const linkMatches = linksContent.matchAll(/\{\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)'(?:,\s*classification:\s*'([^']+)')?/g);
      for (const match of linkMatches) {
        sidebarLinks.push({
          name: match[1],
          slug: match[2],
          classification: match[3] || undefined,
        });
      }
    }

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

function pathToFullSlug(filePath: string): string {
  return filePath
    .replace(/^app\/regions\//, '')
    .replace(/\/page\.tsx$/, '');
}

function getCountryFromSlug(fullSlug: string): string {
  if (!fullSlug) return 'Unknown';
  const country = fullSlug.split('/')[0];
  return country.charAt(0).toUpperCase() + country.slice(1).replace(/-/g, ' ');
}

function convertMarkdownToBlocks(markdown: string): any[] {
  const blocks: any[] = [];
  const paragraphs = markdown.split('\n\n').filter(p => p.trim());

  paragraphs.forEach((para, index) => {
    const trimmed = para.trim();

    if (trimmed.startsWith('#')) {
      const level = (trimmed.match(/^#+/) || [''])[0].length;
      const text = trimmed.replace(/^#+\s*/, '');
      blocks.push({
        _type: 'block',
        _key: `block-${index}`,
        style: `h${Math.min(level, 6)}`,
        children: [{ _type: 'span', text }],
        markDefs: [],
      });
    } else {
      blocks.push({
        _type: 'block',
        _key: `block-${index}`,
        style: 'normal',
        children: [{ _type: 'span', text: trimmed }],
        markDefs: [],
      });
    }
  });

  return blocks;
}

function readGuideContent(contentFile: string): any[] | null {
  const guidePath = path.join(process.cwd(), 'guides', contentFile);

  if (!fs.existsSync(guidePath)) {
    return null;
  }

  try {
    const markdown = fs.readFileSync(guidePath, 'utf-8');
    return convertMarkdownToBlocks(markdown);
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🚀 Starting region export to NDJSON...\n');

  const pageFiles = globSync('app/regions/**/page.tsx');
  console.log(`📁 Found ${pageFiles.length} region page files\n`);

  // Parse all regions
  const regionMap = new Map<string, { data: RegionData; fullSlug: string }>();

  for (const filePath of pageFiles) {
    const fullSlug = pathToFullSlug(filePath);
    const data = parsePageFile(filePath);
    if (data) {
      regionMap.set(fullSlug, { data, fullSlug });
    }
  }

  console.log(`✅ Parsed ${regionMap.size} regions\n`);

  // Sort by depth (parents first)
  const sortedRegions = Array.from(regionMap.entries()).sort((a, b) => {
    return a[0].split('/').length - b[0].split('/').length;
  });

  // Build NDJSON output
  const ndjsonLines: string[] = [];
  const parentRefs = new Map<string, string>();

  for (const [fullSlug, { data }] of sortedRegions) {
    const slug = fullSlug.split('/').pop() || fullSlug;
    const country = getCountryFromSlug(fullSlug);

    // Generate a stable _id based on fullSlug
    const _id = `region-${fullSlug.replace(/\//g, '-')}`;

    // Find parent reference
    let parentRef = undefined;
    if (data.parentRegion) {
      const parentId = parentRefs.get(data.parentRegion);
      if (parentId) {
        parentRef = { _type: 'reference', _ref: parentId };
      }
    }

    // Read guide content
    let content = null;
    if (data.contentFile) {
      content = readGuideContent(data.contentFile);
    }

    // Create document
    const doc: any = {
      _id,
      _type: 'region',
      name: data.title,
      slug: { _type: 'slug', current: slug },
      fullSlug,
      level: data.level,
      country,
    };

    if (parentRef) doc.parentRegion = parentRef;
    if (data.sidebarLinks) doc.sidebarLinks = data.sidebarLinks;
    if (content) doc.content = content;

    // Store this region's ID for children to reference
    parentRefs.set(fullSlug, _id);

    // Add to NDJSON
    ndjsonLines.push(JSON.stringify(doc));
  }

  // Write to file
  const outputPath = path.join(process.cwd(), 'regions-export.ndjson');
  fs.writeFileSync(outputPath, ndjsonLines.join('\n'));

  console.log('\n✨ Export Complete!');
  console.log(`   📝 Exported ${ndjsonLines.length} regions`);
  console.log(`   📁 File: ${outputPath}\n`);
  console.log('Next step: Import with `npx sanity dataset import regions-export.ndjson production`');
}

main().catch(console.error);
