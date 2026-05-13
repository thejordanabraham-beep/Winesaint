/**
 * Migration script to import regions from JSON/Markdown into Payload CMS
 * Uses REST API to avoid Payload local API compatibility issues
 *
 * Run with: npx tsx scripts/migrate-regions-rest.ts
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'
const DATA_DIR = path.join(process.cwd(), 'app/(main)/data')
const GUIDES_DIR = path.join(process.cwd(), 'guides')

// You'll need to set this - get it from Payload admin or use API key
const API_KEY = process.env.PAYLOAD_API_KEY || ''

interface RegionConfig {
  title: string
  level: string
  contentFile?: string
  parentRegion?: string
  sidebarLinks?: Array<{
    name: string
    slug: string
    classification?: string
  }>
  sidebarTitle?: string
  classification?: string
}

interface RegionConfigs {
  [fullSlug: string]: RegionConfig
}

// Map level names to Payload schema values
function normalizeLevel(level: string): string {
  const levelMap: Record<string, string> = {
    'country': 'country',
    'region': 'region',
    'subregion': 'subregion',
    'sub-region': 'subregion',
    'village': 'village',
    'vineyard': 'vineyard',
    'producer': 'vineyard',
  }
  return levelMap[level.toLowerCase()] || 'region'
}

// Map classification names to Payload schema values
function normalizeClassification(classification?: string): string | undefined {
  if (!classification) return undefined

  const classMap: Record<string, string> = {
    'grand_cru': 'grand_cru',
    'grand cru': 'grand_cru',
    'premier_cru': 'premier_cru',
    'premier cru': 'premier_cru',
    '1er cru': 'premier_cru',
    'village': 'village',
    'mga': 'mga',
    'grosses_gewachs': 'grosses_gewachs',
    'grosses gewächs': 'grosses_gewachs',
    'erste_lage': 'erste_lage',
    'erste lage': 'erste_lage',
    'grosse_lage': 'grosse_lage',
    'grosse lage': 'grosse_lage',
  }
  return classMap[classification.toLowerCase()]
}

// Extract country from fullSlug
function getCountry(fullSlug: string): string {
  const parts = fullSlug.split('/')
  const country = parts[0]
  return country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Get simple slug from full path
function getSlug(fullSlug: string): string {
  const parts = fullSlug.split('/')
  return parts[parts.length - 1]
}

async function readMarkdownContent(contentFile?: string): Promise<string | undefined> {
  if (!contentFile) return undefined

  const filePath = path.join(GUIDES_DIR, contentFile)
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8')
    return content
  } catch (err) {
    return undefined
  }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      return response
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Max retries reached')
}

async function findRegionByFullSlug(fullSlug: string): Promise<{ id: string } | null> {
  const url = `${API_URL}/api/regions?where[fullSlug][equals]=${encodeURIComponent(fullSlug)}&limit=1`
  const response = await fetchWithRetry(url, {
    headers: API_KEY ? { 'Authorization': `users API-Key ${API_KEY}` } : {},
  })

  if (!response.ok) return null

  const data = await response.json()
  return data.docs?.[0] || null
}

async function createRegion(data: any): Promise<{ id: string }> {
  const response = await fetchWithRetry(`${API_URL}/api/regions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'Authorization': `users API-Key ${API_KEY}` } : {}),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Create failed: ${error}`)
  }

  return response.json()
}

async function updateRegion(id: string, data: any): Promise<void> {
  const response = await fetchWithRetry(`${API_URL}/api/regions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'Authorization': `users API-Key ${API_KEY}` } : {}),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Update failed: ${error}`)
  }
}

async function migrateRegions() {
  console.log('Starting region migration to Payload CMS via REST API...\n')
  console.log(`API URL: ${API_URL}\n`)

  // Read region configs
  const configPath = path.join(DATA_DIR, 'region-configs.json')
  const regionConfigs: RegionConfigs = JSON.parse(
    await fs.promises.readFile(configPath, 'utf-8')
  )

  const totalRegions = Object.keys(regionConfigs).length
  console.log(`Found ${totalRegions} regions to migrate\n`)

  const slugToId: Record<string, string> = {}
  let processed = 0
  let created = 0
  let updated = 0
  let errors = 0

  // Sort by level depth (countries first, then regions, etc.)
  const sortedSlugs = Object.keys(regionConfigs).sort((a, b) => {
    const depthA = a.split('/').length
    const depthB = b.split('/').length
    return depthA - depthB
  })

  console.log('Pass 1: Creating/updating regions...\n')

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]
    const slug = getSlug(fullSlug)

    try {
      // Read markdown content
      const markdownContent = await readMarkdownContent(config.contentFile)

      // Check if region already exists
      const existing = await findRegionByFullSlug(fullSlug)

      const regionData = {
        name: config.title,
        slug: slug,
        fullSlug: fullSlug,
        level: normalizeLevel(config.level),
        country: getCountry(fullSlug),
        classification: normalizeClassification(config.classification),
        description: markdownContent,
        sidebarTitle: config.sidebarTitle,
      }

      if (existing) {
        // Update existing region
        slugToId[fullSlug] = existing.id
        await updateRegion(existing.id, regionData)
        updated++
      } else {
        // Create new region
        const newRegion = await createRegion(regionData)
        slugToId[fullSlug] = newRegion.id
        created++
      }

      processed++
      if (processed % 50 === 0) {
        console.log(`  Processed ${processed}/${totalRegions} regions (${created} created, ${updated} updated)...`)
      }
    } catch (err: any) {
      console.error(`  Error processing ${fullSlug}: ${err.message}`)
      errors++
    }
  }

  console.log(`\nPass 1 complete: ${created} created, ${updated} updated, ${errors} errors\n`)

  // Second pass: Update parent relationships
  console.log('Pass 2: Updating parent relationships...\n')
  let parentUpdates = 0

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]

    if (!config.parentRegion) continue

    const regionId = slugToId[fullSlug]
    const parentId = slugToId[config.parentRegion]

    if (!regionId || !parentId) {
      continue
    }

    try {
      await updateRegion(regionId, { parentRegion: parentId })
      parentUpdates++
    } catch (err: any) {
      console.error(`  Error updating parent for ${fullSlug}: ${err.message}`)
    }
  }

  console.log(`\nPass 2 complete: Updated ${parentUpdates} parent relationships\n`)

  console.log('Migration complete!')
  console.log(`  Total regions: ${totalRegions}`)
  console.log(`  Created: ${created}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Parent relationships: ${parentUpdates}`)
  console.log(`  Errors: ${errors}`)

  process.exit(0)
}

migrateRegions().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
