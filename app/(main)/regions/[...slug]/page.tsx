import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import RegionLayout from '@/components/RegionLayout';
import { type ClassificationType } from '@/lib/guide-config';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface SidebarLink {
  name: string;
  slug: string;
  classification?: ClassificationType;
  type?: string;
}

interface RegionConfig {
  title: string;
  level: 'country' | 'region' | 'sub-region' | 'subregion' | 'village' | 'vineyard';
  contentFile?: string;
  parentRegion?: string;
  sidebarLinks?: SidebarLink[];
  sidebarTitle?: string;
  classification?: string;
}

interface RegionConfigs {
  [fullSlug: string]: RegionConfig;
}

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api';

interface VineyardData {
  classification?: string;
  acreage?: number;
  hectares?: number;
  soilTypes?: string[];
  aspect?: string;
  slope?: number;
  elevationRange?: { min: number; max: number };
  producers?: Array<{ name: string; slug: string }>;
}

// Fetch region content (description) from Payload
async function getRegionContent(fullSlug: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${API_URL}/regions?where[fullSlug][equals]=${encodeURIComponent(fullSlug)}&depth=0`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const region = data.docs?.[0];

    return region?.description || null;
  } catch (error) {
    console.error('Error fetching region content:', error);
    return null;
  }
}

// Fetch vineyard data from Payload for vineyard-level pages
async function getVineyardDataFromPayload(fullSlug: string): Promise<VineyardData | null> {
  try {
    const response = await fetch(
      `${API_URL}/regions?where[fullSlug][equals]=${encodeURIComponent(fullSlug)}&depth=1`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const region = data.docs?.[0];

    if (!region) return null;

    return {
      classification: region.classification || undefined,
      acreage: region.acreage || undefined,
      aspect: region.aspect || undefined,
    };
  } catch (error) {
    console.error('Error fetching vineyard data:', error);
    return null;
  }
}

// Load region configs
function getRegionConfigs(): RegionConfigs {
  const configPath = path.join(process.cwd(), 'app/data/region-configs.json');
  const configData = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configData);
}

// Get region config by slug
function getRegionConfig(fullSlug: string): RegionConfig | null {
  const configs = getRegionConfigs();
  return configs[fullSlug] || null;
}

// Get children from config file by parentRegion
function getChildrenFromConfig(fullSlug: string): SidebarLink[] {
  const configs = getRegionConfigs();
  const children: SidebarLink[] = [];

  for (const [childSlug, childConfig] of Object.entries(configs)) {
    if (childConfig.parentRegion === fullSlug) {
      // Extract the last part of the slug as the link slug
      const slugParts = childSlug.split('/');
      const linkSlug = slugParts[slugParts.length - 1];

      children.push({
        name: childConfig.title,
        slug: linkSlug,
        classification: childConfig.classification as ClassificationType | undefined,
      });
    }
  }

  // Sort alphabetically by name
  return children.sort((a, b) => a.name.localeCompare(b.name));
}

// Get children from Payload using fullSlug prefix (more reliable than parentRegion)
async function getChildrenFromPayload(fullSlug: string, level: string): Promise<SidebarLink[]> {
  try {
    // Get all regions whose fullSlug starts with this path and is exactly one level deeper
    // e.g., for "france/burgundy", get "france/burgundy/chablis" but not "france/burgundy/chablis/foo"
    const depth = fullSlug.split('/').length;

    // Use like query to find children by fullSlug prefix
    // Note: %25 is URL-encoded %, which Payload uses for LIKE wildcard
    const searchPattern = fullSlug + '/%';
    const url = `${API_URL}/regions?where[fullSlug][like]=${encodeURIComponent(searchPattern)}&limit=500&sort=name`;
    const childrenRes = await fetch(url, { next: { revalidate: 60 } });

    if (!childrenRes.ok) {
      return [];
    }

    const childrenData = await childrenRes.json();
    const allDocs = childrenData.docs || [];

    // Filter to only direct children (one level deeper)
    const directChildren = allDocs.filter((doc: any) => {
      const docParts = doc.fullSlug.split('/');
      return docParts.length === depth + 1;
    });

    // Group by level and return the highest level children
    const childrenByLevel: Record<string, typeof directChildren> = {};
    for (const child of directChildren) {
      if (!childrenByLevel[child.level]) {
        childrenByLevel[child.level] = [];
      }
      childrenByLevel[child.level].push(child);
    }

    // Priority order for returning children
    const levelOrder = ['region', 'subregion', 'village', 'vineyard'];
    for (const lvl of levelOrder) {
      if (childrenByLevel[lvl] && childrenByLevel[lvl].length > 0) {
        return childrenByLevel[lvl].map((child: any) => ({
          name: child.name,
          slug: child.slug,
          classification: child.classification || undefined,
        }));
      }
    }

    return [];
  } catch (error) {
    console.error('Error fetching children from Payload:', error);
    return [];
  }
}

function getNextLevel(level: string): string | null {
  const levelMap: Record<string, string> = {
    'country': 'region',
    'region': 'subregion',
    'subregion': 'village',
    'sub-region': 'village',
    'village': 'vineyard',
  };
  return levelMap[level] || null;
}

function getSidebarTitle(level: string, childLevel?: string): string {
  if (childLevel) {
    switch (childLevel) {
      case 'region': return 'Major Regions';
      case 'subregion': return 'Sub-Regions';
      case 'village': return 'Villages';
      case 'vineyard': return 'Vineyards';
    }
  }
  switch (level) {
    case 'country': return 'Major Regions';
    case 'region': return 'Sub-Regions';
    case 'subregion':
    case 'sub-region': return 'Villages';
    case 'village': return 'Vineyards';
    default: return 'Explore';
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  const config = getRegionConfig(fullSlug);

  if (!config) {
    return { title: 'Region Not Found | WineSaint' };
  }

  return {
    title: `${config.title} Wine Guide | WineSaint`,
    description: `Complete guide to ${config.title} wines, terroir, and producers.`
  };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const fullSlug = slug.join('/');

  const config = getRegionConfig(fullSlug);

  if (!config) {
    notFound();
  }

  // Use sidebarLinks from config if available, otherwise get from config's parentRegion relationships
  let sidebarLinks = config.sidebarLinks;
  let dynamicSidebarTitle: string | undefined;

  if (!sidebarLinks || sidebarLinks.length === 0) {
    // Get children from config file based on parentRegion
    sidebarLinks = getChildrenFromConfig(fullSlug);

    // Set sidebar title based on current level
    if (sidebarLinks.length > 0) {
      dynamicSidebarTitle = getSidebarTitle(config.level);
    }
  }

  // Normalize level to match RegionLayout expectations
  const normalizedLevel = config.level === 'subregion' ? 'sub-region' : config.level;

  // Fetch content from Payload
  const content = await getRegionContent(fullSlug);

  // For vineyard-level pages, fetch rich vineyard data from Payload
  let vineyardData: VineyardData | undefined;
  if (config.level === 'vineyard') {
    const payloadData = await getVineyardDataFromPayload(fullSlug);
    vineyardData = payloadData || { classification: config.classification };
  }

  return (
    <RegionLayout
      title={config.title}
      level={normalizedLevel as 'country' | 'region' | 'sub-region' | 'village' | 'vineyard'}
      parentRegion={config.parentRegion}
      classification={config.classification}
      sidebarLinks={sidebarLinks}
      sidebarTitle={config.sidebarTitle || dynamicSidebarTitle}
      content={content || undefined}
      vineyardData={vineyardData}
    />
  );
}
