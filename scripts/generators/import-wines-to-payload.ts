/**
 * Wine Import Pipeline for Payload CMS
 *
 * Imports wines from CSV into Payload CMS with:
 * - Producer creation/lookup
 * - Region matching (via fullSlug)
 * - Wine creation with relationships
 * - Review creation
 * - Vineyard name storage (text) + optional vineyard relationship
 *
 * Usage:
 *   npx tsx scripts/import-wines-to-payload.ts [csv-file] [--live] [--limit N]
 *
 * Example:
 *   npx tsx scripts/import-wines-to-payload.ts /path/to/wines.csv --live
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { getPayload } from 'payload'
import config from '../payload.config'
import { convertScore } from './score-conversion'
import { matchRegion } from './weg-region-matcher'

// CSV row structure (from existing import-wine-spreadsheet.ts)
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
  // Tracking IDs (written back to CSV after import)
  Payload_Wine_ID?: string
  Payload_Review_ID?: string
}

// Known producer -> region mappings
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
  'Bernhard Ott': 'wagram',
  'Ceritas': 'sonoma-coast',
  'Corison': 'napa-valley',
  'DuMOL': 'russian-river-valley',
  'Failla': 'russian-river-valley',
  'Kistler': 'russian-river-valley',
  'Martinelli': 'russian-river-valley',
  'Mayacamas': 'napa-valley',
  'Mount Eden': 'santa-cruz-mountains',
  'Ramey': 'russian-river-valley',
  'Rhys': 'sonoma-coast',
  'Shafer': 'napa-valley',
}

// Fantasy/brand names that should NOT link to vineyard pages
const FANTASY_NAMES = new Set([
  'Alluvial',
  'Anno Primo',
  'Heritage',
  'Lola',
  'One Point Five',
  'Relentless',
  'Reserve',
  'Selection',
  'Stella',
  'TD-9',
  'Vivien',
])

/**
 * Infer region from producer name if region is missing
 */
function inferRegion(wine: WineRow): string {
  if (wine.Region?.trim()) {
    return wine.Region
  }

  // Try producer map
  if (wine.Producer && PRODUCER_REGION_MAP[wine.Producer]) {
    console.log(`  Inferred region from producer: ${PRODUCER_REGION_MAP[wine.Producer]}`)
    return PRODUCER_REGION_MAP[wine.Producer]
  }

  // Try extracting from wine name
  const wineName = wine['Wine Name'].toLowerCase()
  if (wineName.includes('etna')) return 'etna'
  if (wineName.includes('barolo')) return 'barolo'
  if (wineName.includes('barbaresco')) return 'barbaresco'
  if (wineName.includes('mosel')) return 'mosel'
  if (wineName.includes('smaragd') || wineName.includes('federspiel')) {
    console.log(`  Inferred wachau from wine name (Smaragd/Federspiel)`)
    return 'wachau'
  }

  return ''
}

/**
 * Parse score (handle ranges like "(96-98)")
 */
function parseScore(scoreStr: string): { score100: number; score10: number | null } {
  if (!scoreStr?.trim()) {
    return { score100: 0, score10: null }
  }

  let score100: number

  if (scoreStr.includes('-')) {
    // Handle score ranges: "(96-98)" -> use midpoint
    const match = scoreStr.match(/(\d+)-(\d+)/)
    if (match) {
      const low = parseInt(match[1])
      const high = parseInt(match[2])
      score100 = Math.round((low + high) / 2)
    } else {
      return { score100: 0, score10: null }
    }
  } else {
    score100 = parseInt(scoreStr)
    if (isNaN(score100)) {
      return { score100: 0, score10: null }
    }
  }

  const score10 = convertScore(score100)
  return { score100, score10: score10 || null }
}

/**
 * Generate slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/^(domaine|chateau|château|weingut|estate)\s+/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 96)
}

/**
 * Parse drinking window string (e.g., "2024-2030" or "Now-2035")
 */
function parseDrinkingWindow(window: string): { start: number | null; end: number | null } {
  if (!window?.trim()) return { start: null, end: null }

  const match = window.match(/(\d{4}|\w+)\s*[-–]\s*(\d{4})/)
  if (match) {
    const startYear = match[1].toLowerCase() === 'now' ? new Date().getFullYear() : parseInt(match[1])
    const endYear = parseInt(match[2])
    return {
      start: isNaN(startYear) ? null : startYear,
      end: isNaN(endYear) ? null : endYear,
    }
  }

  return { start: null, end: null }
}

/**
 * Map wine type string to schema value
 */
function mapWineType(colorType: string): string | null {
  if (!colorType) return null

  const lower = colorType.toLowerCase()
  if (lower.includes('red')) return 'red'
  if (lower.includes('white')) return 'white'
  if (lower.includes('rose') || lower.includes('rosé')) return 'rose'
  if (lower.includes('sparkling') || lower.includes('champagne')) return 'sparkling'
  if (lower.includes('dessert') || lower.includes('sweet')) return 'dessert'
  if (lower.includes('fortified') || lower.includes('port') || lower.includes('sherry')) return 'fortified'
  if (lower.includes('orange')) return 'orange'

  return null
}

/**
 * Main import function
 */
async function importWines(csvPath: string, dryRun: boolean, limit?: number) {
  console.log('WINE IMPORT PIPELINE (Payload CMS)')
  console.log('='.repeat(70))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`)
  console.log(`CSV: ${csvPath}`)
  if (limit) console.log(`Limit: ${limit}`)
  console.log('')

  // Initialize Payload
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized\n')

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

  if (limit) {
    wines = wines.slice(0, limit)
  }

  console.log(`Found ${wines.length} wines to import\n`)

  // Track stats
  let successCount = 0
  let errorCount = 0
  let skippedCount = 0
  let producersCreated = 0

  // Cache for lookups
  const producerCache: Record<string, string> = {} // name -> id
  const regionCache: Record<string, string> = {} // fullSlug -> id

  // Pre-load all regions for fast lookup
  console.log('Loading regions from database...')
  const allRegions = await payload.find({
    collection: 'regions',
    limit: 5000,
  })
  for (const region of allRegions.docs) {
    regionCache[region.fullSlug as string] = region.id as string
  }
  console.log(`Loaded ${Object.keys(regionCache).length} regions\n`)

  // Process each wine
  for (let i = 0; i < wines.length; i++) {
    const wine = wines[i]
    console.log(`\n[${i + 1}/${wines.length}] ${wine['Wine Name']}`)

    // Skip if already imported
    if (wine.Payload_Wine_ID) {
      console.log('  Skipped (already imported)')
      skippedCount++
      continue
    }

    try {
      // 1. Infer/match region
      const regionToMatch = inferRegion(wine)
      const wegRegion = matchRegion(regionToMatch)

      let regionId: string | null = null
      if (wegRegion) {
        // Convert WEG URL to fullSlug (e.g., /regions/austria/wachau -> austria/wachau)
        const fullSlug = wegRegion.url.replace('/regions/', '')
        regionId = regionCache[fullSlug] || null

        if (regionId) {
          console.log(`  Region matched: ${fullSlug}`)
        } else {
          console.log(`  Region not in database: ${fullSlug}`)
        }
      } else if (regionToMatch) {
        console.log(`  Region not matched: ${regionToMatch}`)
      }

      // 2. Parse score
      const { score100, score10 } = parseScore(wine.Score)
      if (score10) {
        console.log(`  Score: ${score100}/100 -> ${score10}/10`)
      } else if (wine.Score) {
        console.log(`  Score could not be converted: ${wine.Score}`)
      }

      // 3. Find or create producer
      let producerId = producerCache[wine.Producer]
      if (!producerId) {
        // Check if exists in database
        const existingProducer = await payload.find({
          collection: 'producers',
          where: { name: { equals: wine.Producer } },
          limit: 1,
        })

        if (existingProducer.docs.length > 0) {
          producerId = existingProducer.docs[0].id as string
          producerCache[wine.Producer] = producerId
          console.log(`  Producer found: ${wine.Producer}`)
        } else if (!dryRun) {
          // Create producer
          const newProducer = await payload.create({
            collection: 'producers',
            data: {
              name: wine.Producer,
              slug: generateSlug(wine.Producer),
              region: regionId || undefined,
              country: wine.Country || wegRegion?.country || '',
            },
          })
          producerId = newProducer.id as string
          producerCache[wine.Producer] = producerId
          producersCreated++
          console.log(`  Producer created: ${wine.Producer}`)
        } else {
          console.log(`  [DRY RUN] Would create producer: ${wine.Producer}`)
        }
      }

      // 4. Check for vineyard
      const vineyardName = wine.Vineyard?.trim() || null
      let vineyardId: string | null = null

      if (vineyardName && !FANTASY_NAMES.has(vineyardName) && wine.vineyard_type !== 'fantasy') {
        // Try to find vineyard as a region with level='vineyard'
        const existingVineyard = await payload.find({
          collection: 'regions',
          where: {
            name: { equals: vineyardName },
            level: { equals: 'vineyard' },
          },
          limit: 1,
        })

        if (existingVineyard.docs.length > 0) {
          vineyardId = existingVineyard.docs[0].id as string
          console.log(`  Vineyard found: ${vineyardName}`)
        } else {
          console.log(`  Vineyard stored as text: ${vineyardName}`)
        }
      }

      // 5. Parse drinking window
      const { start: drinkStart, end: drinkEnd } = parseDrinkingWindow(wine['Drinking Window'])

      // 6. Parse price
      let priceUsd: number | null = null
      if (wine['Release Price']) {
        const priceMatch = wine['Release Price'].match(/\d+/)
        if (priceMatch) {
          priceUsd = parseInt(priceMatch[0])
        }
      }

      if (dryRun) {
        console.log('  [DRY RUN] Would create:')
        console.log(`    - Wine: ${wine['Wine Name']} ${wine.Vintage}`)
        console.log(`    - Producer: ${wine.Producer}`)
        if (vineyardName) console.log(`    - Vineyard: ${vineyardName}`)
        if (score10) console.log(`    - Score: ${score10}/10`)
        successCount++
        continue
      }

      // 7. Create wine document
      const wineData: any = {
        name: wine['Wine Name'],
        slug: generateSlug(`${wine['Wine Name']}-${wine.Vintage}`),
        vintage: parseInt(wine.Vintage) || null,
        producer: producerId || undefined,
        region: regionId || undefined,
        vineyard: vineyardId || undefined,
        vineyardName: vineyardName || undefined,
        wineType: mapWineType(wine['Color/Type']),
        priceUsd: priceUsd,
        grapes: wine['Grape Varieties']
          ? await findOrCreateGrapes(payload, wine['Grape Varieties'])
          : undefined,
      }

      const createdWine = await payload.create({
        collection: 'wines',
        data: wineData,
      })
      console.log(`  Wine created: ${createdWine.id}`)

      // 8. Create review document
      const reviewData: any = {
        wine: createdWine.id,
        score: score10 || undefined,
        tastingNotes: wine['Tasting Notes'] || '',
        shortSummary: wine['Tasting Notes']?.split('.')[0] + '.' || '',
        reviewerName: wine.Reviewer || 'WineSaint',
        reviewDate: wine['Review Date'] || new Date().toISOString().split('T')[0],
        drinkingWindowStart: drinkStart,
        drinkingWindowEnd: drinkEnd,
      }

      const createdReview = await payload.create({
        collection: 'reviews',
        data: reviewData,
      })
      console.log(`  Review created: ${createdReview.id}`)

      // Track IDs for CSV update
      wine.Payload_Wine_ID = createdWine.id as string
      wine.Payload_Review_ID = createdReview.id as string

      successCount++
    } catch (error: any) {
      console.error(`  ERROR: ${error.message}`)
      errorCount++
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70))
  console.log('IMPORT SUMMARY')
  console.log('='.repeat(70))
  console.log(`Total wines processed: ${wines.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Skipped (already imported): ${skippedCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Producers created: ${producersCreated}`)
  console.log('='.repeat(70))

  // Write updated CSV with IDs (if live run)
  if (!dryRun && successCount > 0) {
    console.log('\nUpdating CSV with Payload IDs...')
    const backupPath = csvPath.replace('.csv', '_backup.csv')
    fs.writeFileSync(backupPath, fs.readFileSync(csvPath))

    const updatedCsv = stringify(wines, {
      header: true,
      columns: Object.keys(wines[0]),
    })
    fs.writeFileSync(csvPath, updatedCsv)
    console.log(`CSV updated. Backup saved to: ${backupPath}`)
  }

  process.exit(0)
}

/**
 * Find or create grape varieties
 */
async function findOrCreateGrapes(payload: any, grapesStr: string): Promise<string[]> {
  const grapeNames = grapesStr.split(',').map((g) => g.trim()).filter(Boolean)
  const grapeIds: string[] = []

  for (const name of grapeNames) {
    // Check if exists
    const existing = await payload.find({
      collection: 'grapes',
      where: { name: { equals: name } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      grapeIds.push(existing.docs[0].id as string)
    } else {
      // Create new grape
      const newGrape = await payload.create({
        collection: 'grapes',
        data: {
          name,
          slug: generateSlug(name),
          color: inferGrapeColor(name),
        },
      })
      grapeIds.push(newGrape.id as string)
    }
  }

  return grapeIds
}

/**
 * Infer grape color from name
 */
function inferGrapeColor(name: string): 'red' | 'white' | 'pink' {
  const redGrapes = [
    'nebbiolo', 'sangiovese', 'pinot noir', 'cabernet', 'merlot', 'syrah',
    'shiraz', 'grenache', 'tempranillo', 'malbec', 'zinfandel', 'barbera',
    'dolcetto', 'nerello', 'blaufrankisch', 'zweigelt', 'spatburgunder',
  ]

  const lower = name.toLowerCase()
  for (const red of redGrapes) {
    if (lower.includes(red)) return 'red'
  }

  return 'white'
}

// CLI entry point
const args = process.argv.slice(2)
const csvPath = args.find((a) => a.endsWith('.csv')) || ''
const dryRun = !args.includes('--live')
const limitIndex = args.indexOf('--limit')
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

if (!csvPath) {
  console.log('Usage: npx tsx scripts/import-wines-to-payload.ts <csv-file> [--live] [--limit N]')
  console.log('')
  console.log('Options:')
  console.log('  --live     Actually import (default is dry run)')
  console.log('  --limit N  Only process first N wines')
  console.log('')
  console.log('Example:')
  console.log('  npx tsx scripts/import-wines-to-payload.ts ~/wines.csv --live --limit 10')
  process.exit(1)
}

importWines(csvPath, dryRun, limit).catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
