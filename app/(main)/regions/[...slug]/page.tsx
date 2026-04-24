import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from '@payload-config';
import RegionLayout from '@/components/RegionLayout';
import { type ClassificationType } from '@/lib/guide-config';

// Allow static generation with revalidation
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

// Pre-render top-level regions at build time for instant loading
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });

    // Get countries and major regions (top 2 levels)
    const regions = await payload.find({
      collection: 'regions',
      where: {
        or: [
          { level: { equals: 'country' } },
          { level: { equals: 'region' } },
        ]
      },
      limit: 500,
    });

    return regions.docs.map((region: any) => ({
      slug: region.fullSlug.split('/'),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

interface SidebarLink {
  name: string;
  slug: string;
  classification?: ClassificationType;
  type?: string;
}

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

interface PayloadRegion {
  id: number;
  name: string;
  slug: string;
  fullSlug: string;
  level: 'country' | 'region' | 'subregion' | 'village' | 'vineyard';
  country?: string;
  parentRegion?: { id: number; fullSlug: string } | number | null;
  classification?: string;
  description?: string;
  sidebarTitle?: string;
  sidebarLinks?: Array<{ name: string; slug: string; classification?: string }>;
  acreage?: number;
  aspect?: string;
}

// Cached direct DB access - much faster than HTTP API
const getRegionFromPayload = cache(async (fullSlug: string): Promise<PayloadRegion | null> => {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'regions',
      where: { fullSlug: { equals: fullSlug } },
      depth: 1,
      limit: 1,
    });

    if (!result.docs || result.docs.length === 0) return null;

    return result.docs[0] as unknown as PayloadRegion;
  } catch (error) {
    console.error('Error fetching region data:', error);
    return null;
  }
})

// Derive parent region path from fullSlug
function getParentRegionPath(fullSlug: string): string | undefined {
  const parts = fullSlug.split('/');
  if (parts.length <= 1) return undefined;
  return parts.slice(0, -1).join('/');
}

interface ChildRegion {
  name: string;
  slug: string;
  classification?: ClassificationType;
  level?: string;
}

// Get children using direct DB access
async function getChildrenFromPayloadWithLevel(fullSlug: string, regionId: number): Promise<ChildRegion[]> {
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'regions',
      where: { parentRegion: { equals: regionId } },
      limit: 500,
      sort: 'name',
    });

    return (result.docs || []).map((child: any) => ({
      name: child.name,
      slug: child.slug,
      classification: (child.classification || undefined) as ClassificationType | undefined,
      level: child.level,
    }));
  } catch (error) {
    console.error('Error fetching children from Payload:', error);
    return [];
  }
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
  const region = await getRegionFromPayload(fullSlug);

  if (!region) {
    return { title: 'Region Not Found | WineSaint' };
  }

  return {
    title: `${region.name} Wine Guide | WineSaint`,
    description: `Complete guide to ${region.name} wines, terroir, and producers.`
  };
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const fullSlug = slug.join('/');

  // Fetch region from Payload
  const region = await getRegionFromPayload(fullSlug);

  if (!region) {
    notFound();
  }

  // Get parent region path from fullSlug
  const parentRegionPath = getParentRegionPath(fullSlug);

  // Use stored sidebarLinks if available, otherwise query children
  let sidebarLinks: SidebarLink[];
  let dynamicSidebarTitle: string | undefined;

  if (region.sidebarLinks && region.sidebarLinks.length > 0) {
    // Use the explicitly configured sidebar links
    sidebarLinks = region.sidebarLinks.map(link => ({
      name: link.name,
      slug: link.slug,
      classification: (link.classification || undefined) as ClassificationType | undefined,
    }));

    // Fetch first child for sidebar title in parallel with nothing else needed
    const firstChildSlug = fullSlug + '/' + sidebarLinks[0].slug;
    const childRegion = await getRegionFromPayload(firstChildSlug);
    if (childRegion) {
      dynamicSidebarTitle = getSidebarTitle(region.level, childRegion.level);
    }
  } else {
    // Fall back to querying children - this returns child data including level
    const children = await getChildrenFromPayloadWithLevel(fullSlug, region.id);
    sidebarLinks = children.map(child => ({
      name: child.name,
      slug: child.slug,
      classification: (child.classification || undefined) as ClassificationType | undefined,
    }));

    // Use the level from the first child if available
    if (children.length > 0 && children[0].level) {
      dynamicSidebarTitle = getSidebarTitle(region.level, children[0].level);
    }
  }

  // Normalize level to match RegionLayout expectations
  const normalizedLevel = region.level === 'subregion' ? 'sub-region' : region.level;

  // For vineyard-level pages, prepare vineyard data
  let vineyardData: VineyardData | undefined;
  if (region.level === 'vineyard') {
    vineyardData = {
      classification: region.classification,
      acreage: region.acreage,
      aspect: region.aspect,
    };
  }

  return (
    <RegionLayout
      title={region.name}
      fullSlug={region.fullSlug}
      level={normalizedLevel as 'country' | 'region' | 'sub-region' | 'village' | 'vineyard'}
      parentRegion={parentRegionPath}
      classification={region.classification}
      sidebarLinks={sidebarLinks}
      sidebarTitle={region.sidebarTitle || dynamicSidebarTitle}
      markdownContent={region.description}
      vineyardData={vineyardData}
    />
  );
}
