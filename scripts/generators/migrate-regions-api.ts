/**
 * Migration script to import regions via Payload REST API
 *
 * First create your admin user at http://localhost:3000/admin/create-first-user
 * Then set environment variables:
 *   PAYLOAD_ADMIN_EMAIL=your@email.com
 *   PAYLOAD_ADMIN_PASSWORD=yourpassword
 *
 * Run with: npx tsx scripts/migrate-regions-api.ts
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const API_URL = 'http://localhost:3000/api'
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD

let authToken: string | null = null
const DATA_DIR = path.join(process.cwd(), 'app/(main)/data')
const GUIDES_DIR = path.join(process.cwd(), 'guides')
const GUIDES_BACKUP_DIR = path.join(process.cwd(), 'guides-backup-20260222-114624')

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

// Map classification names
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

function getCountry(fullSlug: string): string {
  const parts = fullSlug.split('/')
  const country = parts[0]
  return country.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function getSlug(fullSlug: string): string {
  const parts = fullSlug.split('/')
  return parts[parts.length - 1]
}

async function readMarkdownContent(contentFile?: string): Promise<string | undefined> {
  if (!contentFile) return undefined

  // Try main guides folder first
  const mainPath = path.join(GUIDES_DIR, contentFile)
  try {
    return await fs.promises.readFile(mainPath, 'utf-8')
  } catch {
    // Try backup folder
    const backupPath = path.join(GUIDES_BACKUP_DIR, contentFile)
    try {
      return await fs.promises.readFile(backupPath, 'utf-8')
    } catch {
      return undefined
    }
  }
}

// Extract first paragraph as description (skip the title)
function extractDescription(markdown?: string): string | undefined {
  if (!markdown) return undefined

  const lines = markdown.split('\n')
  let inContent = false
  let description = ''

  for (const line of lines) {
    // Skip title lines
    if (line.startsWith('#')) {
      inContent = true
      continue
    }
    // Skip empty lines at start
    if (!inContent && !line.trim()) continue

    // Found content
    if (line.trim()) {
      description += line + ' '
      if (description.length > 400) break
    } else if (description) {
      // Hit empty line after content
      break
    }
  }

  return description.trim().substring(0, 500) || undefined
}

async function login(): Promise<string> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Missing credentials. Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD environment variables.\n' +
      'First create your admin user at http://localhost:3000/admin/create-first-user'
    )
  }

  console.log(`Logging in as ${ADMIN_EMAIL}...`)

  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Login failed: ${error}`)
  }

  const result = await response.json()
  console.log('Login successful!\n')
  return result.token
}

async function apiRequest(endpoint: string, method: string, data?: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `JWT ${authToken}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API error: ${response.status} - ${error}`)
  }

  return response.json()
}

async function migrateRegions() {
  console.log('Starting region migration via REST API...\n')

  // Login first
  authToken = await login()

  // Read region configs
  const configPath = path.join(DATA_DIR, 'region-configs.json')
  const regionConfigs: RegionConfigs = JSON.parse(
    await fs.promises.readFile(configPath, 'utf-8')
  )

  const totalRegions = Object.keys(regionConfigs).length
  console.log(`Found ${totalRegions} regions to migrate\n`)

  // Sort by depth (countries first)
  const sortedSlugs = Object.keys(regionConfigs).sort((a, b) => {
    return a.split('/').length - b.split('/').length
  })

  const slugToId: Record<string, string> = {}
  let created = 0
  let skipped = 0
  let errors = 0

  console.log('Pass 1: Creating regions...\n')

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]
    const slug = getSlug(fullSlug)

    try {
      // Check if exists
      const existing = await apiRequest(
        `/regions?where[fullSlug][equals]=${encodeURIComponent(fullSlug)}&limit=1`,
        'GET'
      )

      if (existing.docs && existing.docs.length > 0) {
        slugToId[fullSlug] = existing.docs[0].id
        skipped++
        continue
      }

      // Read markdown
      const markdown = await readMarkdownContent(config.contentFile)
      const description = extractDescription(markdown)

      // Create region
      const result = await apiRequest('/regions', 'POST', {
        name: config.title,
        slug: slug,
        fullSlug: fullSlug,
        level: normalizeLevel(config.level),
        country: getCountry(fullSlug),
        classification: normalizeClassification(config.classification),
        description: description,
        sidebarTitle: config.sidebarTitle,
      })

      slugToId[fullSlug] = result.doc.id
      created++

      if (created % 100 === 0) {
        console.log(`  Progress: ${created} created, ${skipped} skipped...`)
      }
    } catch (err: any) {
      console.error(`  Error with ${fullSlug}: ${err.message.substring(0, 100)}`)
      errors++

      // Small delay on errors
      await new Promise(r => setTimeout(r, 100))
    }

    // Small delay to not overwhelm the server
    if ((created + skipped) % 50 === 0) {
      await new Promise(r => setTimeout(r, 50))
    }
  }

  console.log(`\nPass 1 complete: ${created} created, ${skipped} skipped, ${errors} errors\n`)

  // Second pass: Update parent relationships
  console.log('Pass 2: Updating parent relationships...\n')
  let updated = 0

  for (const fullSlug of sortedSlugs) {
    const config = regionConfigs[fullSlug]

    if (!config.parentRegion) continue

    const regionId = slugToId[fullSlug]
    const parentId = slugToId[config.parentRegion]

    if (!regionId || !parentId) continue

    try {
      await apiRequest(`/regions/${regionId}`, 'PATCH', {
        parentRegion: parentId,
      })
      updated++

      if (updated % 100 === 0) {
        console.log(`  Updated ${updated} parent relationships...`)
      }
    } catch (err: any) {
      // Parent relationship errors are less critical
    }

    if (updated % 50 === 0) {
      await new Promise(r => setTimeout(r, 50))
    }
  }

  console.log(`\nPass 2 complete: ${updated} parent relationships updated\n`)

  console.log('Migration complete!')
  console.log(`  Total: ${totalRegions}`)
  console.log(`  Created: ${created}`)
  console.log(`  Skipped (existed): ${skipped}`)
  console.log(`  Updated parents: ${updated}`)
  console.log(`  Errors: ${errors}`)
}

migrateRegions().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
