/**
 * Payload CMS Local API client for fetching data
 * Uses Payload's Local API for direct database access (no HTTP overhead)
 */

import { getPayload } from 'payload'
import config from '@payload-config'

export interface PayloadRegion {
  id: string
  name: string
  slug: string
  fullSlug: string
  level: 'country' | 'region' | 'subregion' | 'village' | 'vineyard'
  country: string
  parentRegion?: PayloadRegion | string
  classification?: string
  description?: string
  content?: any // Lexical rich text
  sidebarTitle?: string
  image?: any
  acreage?: number
  aspect?: string
}

/**
 * Fetch a region by its fullSlug
 */
export async function getRegionBySlug(fullSlug: string): Promise<PayloadRegion | null> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'regions',
      where: {
        fullSlug: { equals: fullSlug }
      },
      depth: 1,
      limit: 1,
    })
    return (data.docs[0] as PayloadRegion) || null
  } catch (error) {
    console.error('Error fetching region:', error)
    return null
  }
}

/**
 * Fetch child regions of a parent
 */
export async function getChildRegions(parentId: string): Promise<PayloadRegion[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'regions',
      where: {
        parentRegion: { equals: parentId }
      },
      limit: 500,
      sort: 'name',
    })
    return data.docs as PayloadRegion[]
  } catch (error) {
    console.error('Error fetching child regions:', error)
    return []
  }
}

/**
 * Fetch all countries (regions with level=country)
 */
export async function getAllCountries(): Promise<PayloadRegion[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'regions',
      where: {
        level: { equals: 'country' }
      },
      limit: 100,
      sort: 'name',
    })
    return data.docs as PayloadRegion[]
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}

/**
 * Get count of child regions for a parent
 */
export async function getChildRegionCount(parentId: string): Promise<number> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.count({
      collection: 'regions',
      where: {
        parentRegion: { equals: parentId }
      },
    })
    return data.totalDocs
  } catch (error) {
    return 0
  }
}

/**
 * Hierarchy levels in order
 */
const HIERARCHY_ORDER: PayloadRegion['level'][] = ['country', 'region', 'subregion', 'village', 'vineyard']

/**
 * Get the next level in the hierarchy
 */
function getNextLevel(currentLevel: PayloadRegion['level']): PayloadRegion['level'] | null {
  const currentIndex = HIERARCHY_ORDER.indexOf(currentLevel)
  if (currentIndex === -1 || currentIndex >= HIERARCHY_ORDER.length - 1) {
    return null
  }
  return HIERARCHY_ORDER[currentIndex + 1]
}

/**
 * Fetch child regions of a parent, filtered to the immediate next hierarchy level
 * Shows the highest level children first (e.g., subregions before vineyards)
 */
export async function getChildRegionsFiltered(parentId: string, parentLevel: PayloadRegion['level']): Promise<PayloadRegion[]> {
  try {
    const payload = await getPayload({ config })
    const data = await payload.find({
      collection: 'regions',
      where: {
        parentRegion: { equals: parentId }
      },
      limit: 500,
      sort: 'name',
    })

    const allChildren = data.docs as PayloadRegion[]

    if (allChildren.length === 0) return []

    // Group children by level
    const childrenByLevel: Record<string, PayloadRegion[]> = {}
    for (const child of allChildren) {
      if (!childrenByLevel[child.level]) {
        childrenByLevel[child.level] = []
      }
      childrenByLevel[child.level].push(child)
    }

    // Find the highest priority level that has children
    // Priority order: immediate next level first, then subsequent levels
    const nextLevel = getNextLevel(parentLevel)

    // Check each level in order starting from the next expected level
    const startIndex = nextLevel ? HIERARCHY_ORDER.indexOf(nextLevel) : 0
    for (let i = startIndex; i < HIERARCHY_ORDER.length; i++) {
      const level = HIERARCHY_ORDER[i]
      if (childrenByLevel[level] && childrenByLevel[level].length > 0) {
        return childrenByLevel[level]
      }
    }

    // Fallback: return all children if no specific level found
    return allChildren
  } catch (error) {
    console.error('Error fetching filtered child regions:', error)
    return []
  }
}

/**
 * Fetch region with its children (for sidebar)
 * Children are filtered to show only the immediate next hierarchy level
 */
export async function getRegionWithChildren(fullSlug: string): Promise<{
  region: PayloadRegion | null
  children: PayloadRegion[]
}> {
  const region = await getRegionBySlug(fullSlug)

  if (!region) {
    return { region: null, children: [] }
  }

  // Use filtered children to show proper hierarchy
  const children = await getChildRegionsFiltered(region.id, region.level)

  return { region, children }
}

/**
 * Build breadcrumb path from fullSlug
 */
export function buildBreadcrumbFromSlug(fullSlug: string): Array<{ name: string; slug: string }> {
  const parts = fullSlug.split('/')
  const breadcrumbs: Array<{ name: string; slug: string }> = []

  let currentPath = ''
  for (const part of parts.slice(0, -1)) { // exclude current page
    currentPath = currentPath ? `${currentPath}/${part}` : part
    breadcrumbs.push({
      name: part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      slug: currentPath
    })
  }

  return breadcrumbs
}
