/**
 * Migration script to import regions from JSON/Markdown into Payload CMS
 *
 * Run with: npx tsx scripts/migrate-regions-to-payload.ts
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'

const DATA_DIR = path.join(process.cwd(), 'app/(main)/data')
const GUIDES_DIR = path.join(process.cwd(), 'guides')

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
    'producer': 'vineyard', // treat producers as vineyards for now
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
  // Convert slug to title case for display
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
    // Try backup folder
    const backupPath = path.join(process.cwd(), 'guides-backup-20260222-114624', contentFile)
    try {
      const content = await fs.promises.readFile(backupPath, 'utf-8')
      return content
    } catch {
      console.log(`  Could not find content file: ${contentFile}`)
      return undefined
    }
  }
}

async function migrateRegions() {
  console.log('Starting region migration to Payload CMS...\n')

  // Initialize Payload
  const payload = await getPayload({ config })
  console.log('Payload initialized\n')

  // Read region configs
  const configPath = path.join(DATA_DIR, 'region-configs.json')
  const regionConfigs: RegionConfigs = JSON.parse(
    await fs.promises.readFile(configPath, 'utf-8')
  )

  const totalRegions = Object.keys(regionConfigs).length
  console.log(`Found ${totalRegions} regions to migrate\n`)

  // First pass: Create all regions without parent relationships
  // We'll update parent relationships in a second pass
  const slugToId: Record<string, string> = {}
  let created = 0
  let errors = 0

  // Sort by level depth (countries first, then regions, etc.)
  const sortedSlugs = Object.keys(regionConfigs).sort((a, b) => {
    const depthA = a.split('/').length
    const depthB = b.split('/').length
    return depthA - depthB
  })

  console.log('Pass 1: Creating regions...\n')

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]
    const slug = getSlug(fullSlug)

    try {
      // Check if region already exists
      const existing = await payload.find({
        collection: 'regions',
        where: { fullSlug: { equals: fullSlug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        slugToId[fullSlug] = existing.docs[0].id as string
        console.log(`  Skipping (exists): ${config.title}`)
        continue
      }

      // Read markdown content
      const markdownContent = await readMarkdownContent(config.contentFile)

      // Create region
      const region = await payload.create({
        collection: 'regions',
        data: {
          name: config.title,
          slug: slug,
          fullSlug: fullSlug,
          level: normalizeLevel(config.level),
          country: getCountry(fullSlug),
          classification: normalizeClassification(config.classification),
          description: markdownContent?.substring(0, 500), // First 500 chars as description
          sidebarTitle: config.sidebarTitle,
          // We'll handle rich text content separately - for now store as plain text
          // content will need to be converted to Lexical format
        },
      })

      slugToId[fullSlug] = region.id as string
      created++

      if (created % 50 === 0) {
        console.log(`  Created ${created}/${totalRegions} regions...`)
      }
    } catch (err: any) {
      console.error(`  Error creating ${fullSlug}: ${err.message}`)
      errors++
    }
  }

  console.log(`\nPass 1 complete: Created ${created} regions, ${errors} errors\n`)

  // Second pass: Update parent relationships
  console.log('Pass 2: Updating parent relationships...\n')
  let updated = 0

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]

    if (!config.parentRegion) continue

    const regionId = slugToId[fullSlug]
    const parentId = slugToId[config.parentRegion]

    if (!regionId || !parentId) {
      console.log(`  Skipping parent update for ${fullSlug}: missing IDs`)
      continue
    }

    try {
      await payload.update({
        collection: 'regions',
        id: regionId,
        data: {
          parentRegion: parentId,
        },
      })
      updated++
    } catch (err: any) {
      console.error(`  Error updating parent for ${fullSlug}: ${err.message}`)
    }
  }

  console.log(`\nPass 2 complete: Updated ${updated} parent relationships\n`)

  console.log('Migration complete!')
  console.log(`  Total regions: ${totalRegions}`)
  console.log(`  Created: ${created}`)
  console.log(`  Updated parents: ${updated}`)
  console.log(`  Errors: ${errors}`)

  process.exit(0)
}

migrateRegions().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
