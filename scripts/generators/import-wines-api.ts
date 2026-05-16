/**
 * Wine Import Pipeline using Payload REST API
 *
 * This version uses the REST API instead of direct Payload SDK,
 * which works regardless of Node.js version compatibility issues.
 *
 * IMPORTANT: The Payload dev server must be running at localhost:3000
 *
 * Usage:
 *   npm run dev  # Start server in another terminal
 *   npx tsx scripts/import-wines-api.ts [csv-file] [--live] [--limit N]
 */

import 'dotenv/config'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { convertScore } from './score-conversion'
import { matchRegion } from './weg-region-matcher'

const API_BASE = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api'

// Auth token (set after login)
let authToken: string | null = null

/**
 * Login to Payload and get auth token
 */
async function login(): Promise<void> {
  const email = process.env.PAYLOAD_ADMIN_EMAIL || 'Jordan@superprimesf.com'
  const password = process.env.PAYLOAD_ADMIN_PASSWORD || 'Password88!'

  const response = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`)
  }

  const data = await response.json()
  authToken = data.token
  console.log('Authenticated as admin')
}

// CSV row structure
interface WineRow {
  Producer: string
  'Wine Name': string
  Vintage: string
  Score: string
  'Color/Type': string
  'Release Price': string
  'Drinking Window': string
  Reviewer: string
  'Review Date': string
  'Tasting Notes': string
  Country?: string
  Region?: string
  'Sub-Region'?: string
  Village?: string
  Vineyard?: string
  vineyard_type?: string
  'Grape Varieties'?: string
  Appellation?: string
  Payload_Wine_ID?: string
  Payload_Review_ID?: string
}

// Producer -> Region mappings
const PRODUCER_REGION_MAP: Record<string, string> = {
  'Benanti': 'etna',
  'Hirsch': 'kamptal',
  'Prager': 'wachau',
  'Knoll': 'wachau',
  'Emmerich Knoll': 'wachau',
  'F.X. Pichler': 'wachau',
  'Rudi Pichler': 'wachau',
  'Donnhoff': 'nahe',
  'Keller': 'rheinhessen',
  'Alzinger': 'wachau',
}

const FANTASY_NAMES = new Set([
  'Alluvial', 'Anno Primo', 'Heritage', 'Lola', 'One Point Five',
  'Relentless', 'Reserve', 'Selection', 'Stella', 'TD-9', 'Vivien',
])

/**
 * Make API request to Payload
 */
async function api(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { 'Authorization': `JWT ${authToken}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error: ${response.status} - ${text}`)
  }

  return response.json()
}

/**
 * Find documents in a collection
 */
async function find(collection: string, where: Record<string, any>): Promise<any[]> {
  const params = new URLSearchParams()

  // Build where query
  for (const [key, value] of Object.entries(where)) {
    if (typeof value === 'object' && value.equals !== undefined) {
      params.append(`where[${key}][equals]`, value.equals)
    } else {
      params.append(`where[${key}][equals]`, String(value))
    }
  }
  params.append('limit', '1')

  const result = await api(`/${collection}?${params.toString()}`)
  return result.docs || []
}

/**
 * Create a document
 */
async function create(collection: string, data: Record<string, any>): Promise<any> {
  return api(`/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Check if a wine already exists (by producer + name + vintage)
 * Returns the existing wine ID if found, null otherwise
 */
async function findExistingWine(producerId: string, wineName: string, vintage: number): Promise<string | null> {
  try {
    const params = new URLSearchParams()
    params.append('where[producer][equals]', producerId)
    params.append('where[name][equals]', wineName)
    params.append('where[vintage][equals]', String(vintage))
    params.append('limit', '1')

    const result = await api(`/wines?${params.toString()}`)
    if (result.docs && result.docs.length > 0) {
      return result.docs[0].id
    }
    return null
  } catch {
    return null
  }
}

function inferRegion(wine: WineRow): string {
  if (wine.Region?.trim()) return wine.Region
  if (wine.Producer && PRODUCER_REGION_MAP[wine.Producer]) {
    console.log(`  Inferred region: ${PRODUCER_REGION_MAP[wine.Producer]}`)
    return PRODUCER_REGION_MAP[wine.Producer]
  }
  const wineName = wine['Wine Name'].toLowerCase()
  if (wineName.includes('etna')) return 'etna'
  if (wineName.includes('barolo')) return 'barolo'
  if (wineName.includes('smaragd') || wineName.includes('federspiel')) return 'wachau'
  return ''
}

function parseScore(scoreStr: string): { score100: number; score10: number | null } {
  if (!scoreStr?.trim()) return { score100: 0, score10: null }
  let score100: number
  if (scoreStr.includes('-')) {
    const match = scoreStr.match(/(\d+)-(\d+)/)
    if (match) {
      score100 = Math.round((parseInt(match[1]) + parseInt(match[2])) / 2)
    } else {
      return { score100: 0, score10: null }
    }
  } else {
    score100 = parseInt(scoreStr)
    if (isNaN(score100)) return { score100: 0, score10: null }
  }
  const score10 = convertScore(score100)
  return { score100, score10: score10 || null }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/^(domaine|chateau|château|weingut|estate)\s+/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 96)
}

function parseDrinkingWindow(window: string): { start: number | null; end: number | null } {
  if (!window?.trim()) return { start: null, end: null }
  const match = window.match(/(\d{4}|\w+)\s*[-–]\s*(\d{4})/)
  if (match) {
    const startYear = match[1].toLowerCase() === 'now' ? new Date().getFullYear() : parseInt(match[1])
    return {
      start: isNaN(startYear) ? null : startYear,
      end: parseInt(match[2]) || null,
    }
  }
  return { start: null, end: null }
}

function mapWineType(colorType: string): string | null {
  if (!colorType) return null
  const lower = colorType.toLowerCase()
  if (lower.includes('red')) return 'red'
  if (lower.includes('white')) return 'white'
  if (lower.includes('rose') || lower.includes('rosé')) return 'rose'
  if (lower.includes('sparkling')) return 'sparkling'
  if (lower.includes('dessert')) return 'dessert'
  return null
}

async function importWines(csvPath: string, dryRun: boolean, limit?: number) {
  console.log('WINE IMPORT PIPELINE (Payload REST API)')
  console.log('='.repeat(70))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`)
  console.log(`API: ${API_BASE}`)
  console.log(`CSV: ${csvPath}`)
  if (limit) console.log(`Limit: ${limit}`)
  console.log('')

  // Login and test API connection
  console.log('Authenticating...')
  try {
    await login()
    await api('/regions?limit=1')
    console.log('API connected\n')
  } catch (err: any) {
    console.error(`Cannot connect to Payload API at ${API_BASE}`)
    console.error('Make sure the dev server is running: npm run dev')
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }

  // Read CSV
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`)
    process.exit(1)
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  let wines: WineRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  })

  if (limit) wines = wines.slice(0, limit)
  console.log(`Found ${wines.length} wines to import\n`)

  // Load regions
  console.log('Loading regions...')
  const regionsResult = await api('/regions?limit=5000')
  const regionCache: Record<string, string> = {}
  for (const region of regionsResult.docs || []) {
    regionCache[region.fullSlug] = region.id
  }
  console.log(`Loaded ${Object.keys(regionCache).length} regions\n`)

  const producerCache: Record<string, string> = {}
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  let duplicateCount = 0
  let producersCreated = 0

  for (let i = 0; i < wines.length; i++) {
    const wine = wines[i]
    console.log(`\n[${i + 1}/${wines.length}] ${wine['Wine Name']}`)

    if (wine.Payload_Wine_ID?.trim()) {
      console.log('  Skipped (already imported)')
      skippedCount++
      continue
    }

    try {
      // Match region
      const regionToMatch = inferRegion(wine)
      const wegRegion = matchRegion(regionToMatch)
      let regionId: string | null = null

      if (wegRegion) {
        const fullSlug = wegRegion.url.replace('/regions/', '')
        regionId = regionCache[fullSlug] || null
        if (regionId) console.log(`  Region: ${fullSlug}`)
      }

      // Parse score
      const { score100, score10 } = parseScore(wine.Score)
      if (score10) console.log(`  Score: ${score100}/100 -> ${score10}/10`)

      // Find/create producer
      let producerId = producerCache[wine.Producer]
      if (!producerId) {
        const existing = await find('producers', { name: wine.Producer })
        if (existing.length > 0) {
          producerId = existing[0].id
          producerCache[wine.Producer] = producerId
        } else if (!dryRun) {
          const newProducer = await create('producers', {
            name: wine.Producer,
            slug: generateSlug(wine.Producer),
            region: regionId || undefined,
            country: wine.Country || wegRegion?.country || '',
          })
          producerId = newProducer.doc?.id || newProducer.id
          producerCache[wine.Producer] = producerId
          producersCreated++
          console.log(`  Producer created: ${wine.Producer}`)
        }
      }

      // Check for vineyard
      const vineyardName = wine.Vineyard?.trim() || null
      let vineyardId: string | null = null
      if (vineyardName && !FANTASY_NAMES.has(vineyardName)) {
        const existing = await find('regions', { name: vineyardName })
        if (existing.length > 0 && existing[0].level === 'vineyard') {
          vineyardId = existing[0].id
          console.log(`  Vineyard found: ${vineyardName}`)
        }
      }

      const { start: drinkStart, end: drinkEnd } = parseDrinkingWindow(wine['Drinking Window'])

      let priceUsd: number | null = null
      if (wine['Release Price']) {
        const match = wine['Release Price'].match(/\d+/)
        if (match) priceUsd = parseInt(match[0])
      }

      // Check for duplicate wine (same producer + name + vintage)
      const vintage = parseInt(wine.Vintage) || 0
      if (producerId && vintage) {
        const existingWineId = await findExistingWine(producerId, wine['Wine Name'], vintage)
        if (existingWineId) {
          console.log(`  Duplicate found (${existingWineId}) - skipping`)
          wine.Payload_Wine_ID = existingWineId
          duplicateCount++
          continue
        }
      }

      if (dryRun) {
        console.log('  [DRY RUN] Would create:')
        console.log(`    Wine: ${wine['Wine Name']} ${wine.Vintage}`)
        console.log(`    Producer: ${wine.Producer}`)
        if (vineyardName) console.log(`    Vineyard: ${vineyardName}`)
        if (score10) console.log(`    Score: ${score10}/10`)
        successCount++
        continue
      }

      // Create wine (review data inline on wine)
      const wineResult = await create('wines', {
        name: wine['Wine Name'],
        slug: generateSlug(`${wine['Wine Name']}-${wine.Vintage}`),
        vintage: parseInt(wine.Vintage) || null,
        producer: producerId || undefined,
        region: regionId || undefined,
        vineyard: vineyardId || undefined,
        vineyardName: vineyardName || undefined,
        wineType: mapWineType(wine['Color/Type']),
        priceUsd: priceUsd,
        score: score10 || undefined,
        tastingNotes: wine['Tasting Notes'] || '',
        shortSummary: wine['Tasting Notes']?.split('.')[0] + '.' || '',
        reviewerName: wine.Reviewer || 'WineSaint',
        reviewDate: new Date().toISOString().split('T')[0],
        drinkingWindowStart: drinkStart,
        drinkingWindowEnd: drinkEnd,
      })
      const wineId = wineResult.doc?.id || wineResult.id
      console.log(`  Wine created: ${wineId} (score: ${score10})`)

      wine.Payload_Wine_ID = wineId
      successCount++

    } catch (error: any) {
      console.error(`  ERROR: ${error.message}`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('IMPORT SUMMARY')
  console.log('='.repeat(70))
  console.log(`Total: ${wines.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Skipped (already in CSV): ${skippedCount}`)
  console.log(`Duplicates (in database): ${duplicateCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Producers created: ${producersCreated}`)

  if (!dryRun && successCount > 0) {
    console.log('\nUpdating CSV with IDs...')
    const backupPath = csvPath.replace('.csv', '_backup.csv')
    fs.writeFileSync(backupPath, fs.readFileSync(csvPath))
    const updatedCsv = stringify(wines, { header: true, columns: Object.keys(wines[0]) })
    fs.writeFileSync(csvPath, updatedCsv)
    console.log(`Backup: ${backupPath}`)
  }
}

// CLI
const args = process.argv.slice(2)
const csvPath = args.find(a => a.endsWith('.csv')) || ''
const dryRun = !args.includes('--live')
const limitIndex = args.indexOf('--limit')
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

if (!csvPath || args.includes('--help')) {
  console.log('Wine Import Pipeline (REST API)')
  console.log('')
  console.log('Usage: npx tsx scripts/import-wines-api.ts <csv-file> [options]')
  console.log('')
  console.log('Options:')
  console.log('  --live     Actually import (default is dry run)')
  console.log('  --limit N  Only process first N wines')
  console.log('')
  console.log('IMPORTANT: The dev server must be running (npm run dev)')
  console.log('')
  console.log('Example:')
  console.log('  npx tsx scripts/import-wines-api.ts ~/wines.csv --live --limit 10')
  process.exit(csvPath ? 0 : 1)
}

importWines(csvPath, dryRun, limit).catch(err => {
  console.error('Import failed:', err)
  process.exit(1)
})
