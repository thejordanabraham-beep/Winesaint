/**
 * Direct database migration for regions
 * Bypasses Payload API for faster migration
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import fs from 'fs'
import path from 'path'

const { Client } = pg

const DATA_DIR = path.join(process.cwd(), 'app/(main)/data')
const GUIDES_DIR = path.join(process.cwd(), 'guides')

interface RegionConfig {
  title: string
  level: string
  contentFile?: string
  parentRegion?: string
  sidebarTitle?: string
  classification?: string
}

interface RegionConfigs {
  [fullSlug: string]: RegionConfig
}

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

function normalizeClassification(classification?: string): string | null {
  if (!classification) return null

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
  return classMap[classification.toLowerCase()] || null
}

function getCountry(fullSlug: string): string {
  const parts = fullSlug.split('/')
  const country = parts[0]
  return country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function getSlug(fullSlug: string): string {
  const parts = fullSlug.split('/')
  return parts[parts.length - 1]
}

function readMarkdownContent(contentFile: string | undefined, slug: string, title: string): string | null {
  // Try explicit contentFile first
  if (contentFile) {
    const filePath = path.join(GUIDES_DIR, contentFile)
    try {
      return fs.readFileSync(filePath, 'utf-8')
    } catch {
      // Fall through to try derived names
    }
  }

  // Try derived filename: {slug}-guide.md
  const derivedFile = `${slug}-guide.md`
  const derivedPath = path.join(GUIDES_DIR, derivedFile)
  try {
    return fs.readFileSync(derivedPath, 'utf-8')
  } catch {
    // Fall through
  }

  // Try title-based filename (handles accents): {title-slugified}-guide.md
  const titleSlug = title.toLowerCase().replace(/\s+/g, '-')
  const titleFile = `${titleSlug}-guide.md`
  const titlePath = path.join(GUIDES_DIR, titleFile)
  try {
    return fs.readFileSync(titlePath, 'utf-8')
  } catch {
    // Fall through
  }

  // Try vineyard suffix: {slug}-vineyard-guide.md
  const vineyardFile = `${slug}-vineyard-guide.md`
  const vineyardPath = path.join(GUIDES_DIR, vineyardFile)
  try {
    return fs.readFileSync(vineyardPath, 'utf-8')
  } catch {
    return null
  }
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database\n')

  // Check existing regions table structure
  const tableCheck = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'regions'
    ORDER BY ordinal_position
  `)

  if (tableCheck.rows.length === 0) {
    console.log('Regions table does not exist. Creating...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        full_slug TEXT UNIQUE NOT NULL,
        level TEXT NOT NULL,
        country TEXT NOT NULL,
        parent_region_id INTEGER REFERENCES regions(id),
        classification TEXT,
        description TEXT,
        sidebar_title TEXT,
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
  } else {
    console.log('Regions table exists with columns:', tableCheck.rows.map(r => r.column_name).join(', '))
  }

  // Read region configs
  const configPath = path.join(DATA_DIR, 'region-configs.json')
  const regionConfigs: RegionConfigs = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

  const totalRegions = Object.keys(regionConfigs).length
  console.log(`\nFound ${totalRegions} regions to migrate\n`)

  // Sort by depth (parents first)
  const sortedSlugs = Object.keys(regionConfigs).sort((a, b) => {
    return a.split('/').length - b.split('/').length
  })

  // Build slug -> id map as we insert
  const slugToId: Record<string, number> = {}

  // First pass: get existing IDs
  const existingRes = await client.query('SELECT id, full_slug FROM regions')
  for (const row of existingRes.rows) {
    slugToId[row.full_slug] = row.id
  }
  console.log(`Found ${existingRes.rows.length} existing regions\n`)

  let created = 0
  let updated = 0
  let errors = 0

  console.log('Migrating regions...\n')

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]
    const slug = getSlug(fullSlug)
    const markdownContent = readMarkdownContent(config.contentFile, slug, config.title)
    const parentSlug = config.parentRegion

    try {
      // Check if exists
      const existing = await client.query(
        'SELECT id FROM regions WHERE full_slug = $1',
        [fullSlug]
      )

      const parentId = parentSlug ? slugToId[parentSlug] : null

      if (existing.rows.length > 0) {
        // Update existing
        await client.query(`
          UPDATE regions SET
            name = $1,
            slug = $2,
            level = $3,
            country = $4,
            parent_region_id = $5,
            classification = $6,
            description = $7,
            sidebar_title = $8,
            updated_at = NOW()
          WHERE full_slug = $9
        `, [
          config.title,
          slug,
          normalizeLevel(config.level),
          getCountry(fullSlug),
          parentId,
          normalizeClassification(config.classification),
          markdownContent,
          config.sidebarTitle || null,
          fullSlug
        ])
        slugToId[fullSlug] = existing.rows[0].id
        updated++
      } else {
        // Insert new
        const insertRes = await client.query(`
          INSERT INTO regions (name, slug, full_slug, level, country, parent_region_id, classification, description, sidebar_title)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
        `, [
          config.title,
          slug,
          fullSlug,
          normalizeLevel(config.level),
          getCountry(fullSlug),
          parentId,
          normalizeClassification(config.classification),
          markdownContent,
          config.sidebarTitle || null
        ])
        slugToId[fullSlug] = insertRes.rows[0].id
        created++
      }

      if ((created + updated) % 100 === 0) {
        console.log(`  Processed ${created + updated}/${totalRegions}...`)
      }
    } catch (err: any) {
      console.error(`  Error with ${fullSlug}: ${err.message}`)
      errors++
    }
  }

  console.log(`\nMigration complete!`)
  console.log(`  Created: ${created}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Errors: ${errors}`)

  // Verify
  const countRes = await client.query('SELECT COUNT(*) as count FROM regions')
  console.log(`\nTotal regions in database: ${countRes.rows[0].count}`)

  await client.end()
}

main().catch(console.error)
