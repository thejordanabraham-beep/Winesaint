import { freshClient as client } from './client';
import type { Appellation, Vineyard } from '@/types';

// Fetch top-level regions (continents/countries without parents: United States, Europe)
export async function fetchTopLevelRegions(): Promise<{
  region: null;
  children: Appellation[];
}> {
  const children = await client.fetch<Appellation[]>(`
    *[_type == "appellation" && !defined(parentAppellation)] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      boundaries,
      centerPoint,
      level,
      "childCount": count(*[_type == "appellation" && parentAppellation._ref == ^._id])
    }
  `);

  return { region: null, children };
}

// Fetch a region by slug with its direct children
export async function fetchRegionWithChildren(slug: string): Promise<{
  region: Appellation | null;
  children: Appellation[];
}> {
  const region = await client.fetch<Appellation | null>(`
    *[_type == "appellation" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      boundaries,
      centerPoint,
      description,
      level,
      totalAcreage,
      establishedYear,
      "parentAppellation": parentAppellation->{
        _id,
        name,
        "slug": slug.current
      }
    }
  `, { slug });

  if (!region) return { region: null, children: [] };

  // Fetch direct children
  const children = await client.fetch<Appellation[]>(`
    *[_type == "appellation" && parentAppellation._ref == $id] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      boundaries,
      centerPoint,
      totalAcreage,
      level,
      "childCount": count(*[_type == "appellation" && parentAppellation._ref == ^._id]),
      "vineyardCount": count(*[_type == "vineyard" && appellation._ref == ^._id])
    }
  `, { id: region._id });

  return { region, children };
}

// Fetch a sub-AVA with its vineyards AND sibling sub-AVAs
export async function fetchSubAVAWithVineyards(subAvaSlug: string): Promise<{
  region: Appellation | null;
  children: Vineyard[];
  siblings: Appellation[];
}> {
  const region = await client.fetch<Appellation | null>(`
    *[_type == "appellation" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      boundaries,
      centerPoint,
      description,
      totalAcreage,
      establishedYear,
      level,
      "parentAppellation": parentAppellation->{
        _id,
        name,
        "slug": slug.current
      }
    }
  `, { slug: subAvaSlug });

  if (!region) return { region: null, children: [], siblings: [] };

  // Fetch vineyards for this sub-AVA
  const children = await client.fetch<Vineyard[]>(`
    *[_type == "vineyard" && appellation._ref == $id] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      boundaries,
      labelPosition,
      acreage,
      primaryGrapes,
      description
    }
  `, { id: region._id });

  // Fetch ALL sibling sub-AVAs (all sub-AVAs under the same parent)
  const parentId = region.parentAppellation?._id;
  const siblings = parentId ? await client.fetch<Appellation[]>(`
    *[_type == "appellation" && parentAppellation._ref == $parentId && _id != $currentId] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      boundaries,
      centerPoint,
      totalAcreage,
      "vineyardCount": count(*[_type == "vineyard" && appellation._ref == ^._id])
    }
  `, { parentId, currentId: region._id }) : [];

  return { region, children, siblings };
}

// Build breadcrumbs from URL path
async function buildBreadcrumbs(currentPath: string[]): Promise<{ name: string; slug: string; path: string }[]> {
  const breadcrumbs: { name: string; slug: string; path: string }[] = [
    { name: 'Maps', slug: 'maps', path: '/maps' }
  ];

  let pathAccum = '/maps';
  for (let i = 0; i < currentPath.length; i++) {
    const slug = currentPath[i];
    pathAccum += `/${slug}`;

    const regionData = await client.fetch<{ name: string } | null>(
      `*[_type == "appellation" && slug.current == $slug][0]{ name }`,
      { slug }
    );

    breadcrumbs.push({
      name: regionData?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug,
      path: pathAccum,
    });
  }

  return breadcrumbs;
}

// Map appellation levels to display levels
function getDisplayLevel(level: string | undefined): 'continent' | 'country' | 'state' | 'sub_region' | 'major_ava' | 'sub_ava' {
  switch (level) {
    case 'continent': return 'continent';
    case 'country': return 'country';
    case 'state': return 'state';
    case 'sub_region': return 'sub_region';
    case 'major_ava': return 'major_ava';
    case 'sub_ava': return 'sub_ava';
    default: return 'major_ava';
  }
}

// Determine the level to show based on what we're displaying
function determineDisplayLevel(region: Appellation | null, children: Appellation[]): 'continent' | 'country' | 'state' | 'sub_region' | 'major_ava' | 'sub_ava' {
  if (!region) {
    // Top level - showing continents/top-level countries
    return 'continent';
  }

  // Use the region's level to determine what we're showing as children
  switch (region.level) {
    case 'continent':
      return 'continent'; // Showing countries
    case 'country':
      return 'country'; // Showing states/regions
    case 'state':
      return 'state'; // Showing sub-regions or major AVAs
    case 'sub_region':
      return 'sub_region'; // Showing major AVAs/appellations
    case 'major_ava':
      return 'major_ava'; // Showing sub-AVAs or nested major AVAs
    case 'sub_ava':
      return 'sub_ava'; // Showing vineyards
    default:
      // Infer from children
      if (children.length > 0) {
        const childLevel = children[0].level;
        if (childLevel === 'country') return 'continent';
        if (childLevel === 'state') return 'country';
        if (childLevel === 'sub_region') return 'state';
        if (childLevel === 'major_ava') return 'sub_region';
        if (childLevel === 'sub_ava') return 'major_ava';
      }
      return 'major_ava';
  }
}

// Main fetch function - supports arbitrary nesting depth
export async function fetchMapData(path: string[]): Promise<{
  level: 'continent' | 'country' | 'state' | 'sub_region' | 'major_ava' | 'sub_ava';
  region: Appellation | null;
  children: (Appellation | Vineyard)[];
  siblings: Appellation[];
  breadcrumbs: { name: string; slug: string; path: string }[];
}> {
  // Root level: show all top-level regions (United States, Europe)
  if (path.length === 0) {
    const { children } = await fetchTopLevelRegions();
    return {
      level: 'continent',
      region: null,
      children,
      siblings: [],
      breadcrumbs: [{ name: 'Maps', slug: 'maps', path: '/maps' }],
    };
  }

  // Fetch the region at the last slug in the path
  const targetSlug = path[path.length - 1];
  const { region, children: appellationChildren } = await fetchRegionWithChildren(targetSlug);

  if (!region) {
    // Region not found - fallback to top level
    const { children: topChildren } = await fetchTopLevelRegions();
    return {
      level: 'continent',
      region: null,
      children: topChildren,
      siblings: [],
      breadcrumbs: [{ name: 'Maps', slug: 'maps', path: '/maps' }],
    };
  }

  // Build breadcrumbs
  const breadcrumbs = await buildBreadcrumbs(path);

  // Determine display level
  const displayLevel = determineDisplayLevel(region, appellationChildren);

  // Check if this region has appellation children or should show vineyards
  if (appellationChildren.length > 0) {
    // Fetch siblings if this region has a parent appellation
    let siblings: Appellation[] = [];
    if (region.parentAppellation) {
      siblings = await client.fetch<Appellation[]>(`
        *[_type == "appellation" && parentAppellation._ref == $parentId && _id != $currentId] | order(name asc) {
          _id,
          name,
          "slug": slug.current,
          boundaries,
          centerPoint,
          totalAcreage,
          level,
          "childCount": count(*[_type == "appellation" && parentAppellation._ref == ^._id])
        }
      `, { parentId: region.parentAppellation._id, currentId: region._id });
    }

    return {
      level: displayLevel,
      region,
      children: appellationChildren,
      siblings,
      breadcrumbs,
    };
  } else {
    // No appellation children - check for vineyards
    const { region: subRegion, children: vineyards, siblings } = await fetchSubAVAWithVineyards(targetSlug);

    return {
      level: 'sub_ava',
      region: subRegion,
      children: vineyards,
      siblings,
      breadcrumbs,
    };
  }
}
