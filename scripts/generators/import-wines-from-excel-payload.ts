/**
 * Excel Wine Importer for Payload CMS
 *
 * Reads wine data from Excel spreadsheet and imports to Payload CMS.
 * Based on the "Master Drink Note Sheet" format.
 *
 * Excel columns expected:
 *   B: Producer/Wine Name
 *   C: Region
 *   D: Country
 *   E: Vintage
 *   F: Price
 *   G: Tasting Notes
 *   H: Score (0-10 scale)
 *   I: Situation/Context
 *   J: Drinking Window
 *
 * Usage:
 *   npx tsx scripts/import-wines-from-excel-payload.ts [excel-file] [--live] [--limit N] [--start-row N]
 */

import 'dotenv/config'
import * as XLSX from 'xlsx'
import { getPayload } from 'payload'
import config from '../payload.config'
import { matchRegion } from './weg-region-matcher'

interface ParsedWine {
  fullName: string
  producerName: string
  wineName: string
  vintage: number
  region: string
  country: string
  price: number
  tastingNotes: string
  score: number // 0-10 scale
  context: string
  drinkingWindow: string
}

/**
 * Parse wine name to extract producer and wine name
 */
function parseWineName(fullText: string): { producer: string; wineName: string } {
  // Try to split on newlines first (producer on first line)
  const lines = fullText
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l)

  if (lines.length >= 2) {
    return {
      producer: lines[0],
      wineName: lines.slice(1).join(' '),
    }
  }

  // Fallback: use full text as both
  return {
    producer: lines[0] || fullText,
    wineName: fullText,
  }
}

/**
 * Parse score from cell (handle strings like "7.4" or complex formats)
 */
function parseScore(scoreText: any): number {
  if (typeof scoreText === 'number') return scoreText
  if (!scoreText) return 0

  const str = String(scoreText)
  const match = str.match(/(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : 0
}

/**
 * Convert 0-10 score to 10-point review scale
 * (The Excel scores are already 0-10, we just normalize)
 */
function normalizeScore(score: number): number {
  // Clamp to 1-10 range, round to 1 decimal
  const normalized = Math.max(1, Math.min(10, score))
  return Math.round(normalized * 10) / 10
}

/**
 * Generate slug from text
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/^(domaine|chateau|château|weingut|estate)\s+/i, '')
    .replace(/[\s\r\n]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 96)
}

/**
 * Parse drinking window string
 */
function parseDrinkingWindow(window: string): { start: number | null; end: number | null } {
  if (!window?.trim()) return { start: null, end: null }

  const match = window.match(/(\d{4}|\w+)\s*[-–]\s*(\d{4})/)
  if (match) {
    const startYear =
      match[1].toLowerCase() === 'now' ? new Date().getFullYear() : parseInt(match[1])
    const endYear = parseInt(match[2])
    return {
      start: isNaN(startYear) ? null : startYear,
      end: isNaN(endYear) ? null : endYear,
    }
  }

  return { start: null, end: null }
}

/**
 * Read wines from Excel file
 */
function readExcelWines(
  filePath: string,
  sheetName: string = 'WINE',
  startRow: number = 2,
  limit?: number
): ParsedWine[] {
  console.log(`Reading Excel file: ${filePath}`)

  const workbook = XLSX.readFile(filePath)

  // Use specified sheet or first sheet
  const actualSheet = workbook.SheetNames.includes(sheetName)
    ? sheetName
    : workbook.SheetNames[0]

  console.log(`Using sheet: ${actualSheet}`)

  const worksheet = workbook.Sheets[actualSheet]
  const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

  console.log(`Total rows: ${data.length}`)
  console.log(`Starting from row: ${startRow}`)

  const wines: ParsedWine[] = []
  const endRow = limit ? Math.min(startRow + limit, data.length) : data.length

  for (let i = startRow - 1; i < endRow; i++) {
    const row = data[i]
    if (!row || !row[1]) continue // Skip empty rows

    const producerText = String(row[1] || '')
    const { producer, wineName } = parseWineName(producerText)

    const region = String(row[2] || '')
    const country = String(row[3] || '')
    const vintage = typeof row[4] === 'number' ? row[4] : parseInt(String(row[4])) || 0
    const price = typeof row[5] === 'number' ? row[5] : 0
    const tastingNotes = String(row[6] || '')
    const score = parseScore(row[7])
    const situation = String(row[8] || '')
    const drinkingWindow = String(row[9] || '')

    // Skip if missing critical data
    if (!producer || vintage === 0) {
      console.log(`  Skipping row ${i + 1}: Missing producer or vintage`)
      continue
    }

    wines.push({
      fullName: producerText,
      producerName: producer,
      wineName: wineName || producer,
      vintage,
      region,
      country,
      price,
      tastingNotes,
      score,
      context: [situation, drinkingWindow].filter(Boolean).join('\n\n'),
      drinkingWindow,
    })
  }

  console.log(`Parsed ${wines.length} wines\n`)
  return wines
}

/**
 * Main import function
 */
async function importFromExcel(
  excelPath: string,
  dryRun: boolean,
  startRow: number,
  limit?: number
) {
  console.log('EXCEL WINE IMPORTER (Payload CMS)')
  console.log('='.repeat(70))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`)
  console.log(`Excel: ${excelPath}`)
  console.log(`Start row: ${startRow}`)
  if (limit) console.log(`Limit: ${limit}`)
  console.log('')

  // Initialize Payload
  console.log('Initializing Payload...')
  const payload = await getPayload({ config })
  console.log('Payload initialized\n')

  // Read Excel
  const wines = readExcelWines(excelPath, 'WINE', startRow, limit)

  if (wines.length === 0) {
    console.log('No wines found in Excel')
    process.exit(1)
  }

  // Pre-load regions
  console.log('Loading regions from database...')
  const allRegions = await payload.find({
    collection: 'regions',
    limit: 5000,
  })
  const regionCache: Record<string, string> = {}
  for (const region of allRegions.docs) {
    regionCache[region.fullSlug as string] = region.id as string
  }
  console.log(`Loaded ${Object.keys(regionCache).length} regions\n`)

  // Producer cache
  const producerCache: Record<string, string> = {}

  // Stats
  let successCount = 0
  let errorCount = 0
  let producersCreated = 0

  for (const [index, wine] of wines.entries()) {
    console.log(`\n[${index + 1}/${wines.length}] ${wine.fullName}`)

    try {
      // 1. Match region
      const wegRegion = matchRegion(wine.region)
      let regionId: string | null = null

      if (wegRegion) {
        const fullSlug = wegRegion.url.replace('/regions/', '')
        regionId = regionCache[fullSlug] || null
        if (regionId) {
          console.log(`  Region: ${fullSlug}`)
        }
      }

      // 2. Normalize score (already 0-10)
      const score10 = wine.score > 0 ? normalizeScore(wine.score) : null
      if (score10) {
        console.log(`  Score: ${score10}/10`)
      }

      // 3. Find or create producer
      let producerId = producerCache[wine.producerName]
      if (!producerId) {
        const existing = await payload.find({
          collection: 'producers',
          where: { name: { equals: wine.producerName } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          producerId = existing.docs[0].id as string
          producerCache[wine.producerName] = producerId
        } else if (!dryRun) {
          const newProducer = await payload.create({
            collection: 'producers',
            data: {
              name: wine.producerName,
              slug: generateSlug(wine.producerName),
              region: regionId || undefined,
              country: wine.country || wegRegion?.country || '',
            },
          })
          producerId = newProducer.id as string
          producerCache[wine.producerName] = producerId
          producersCreated++
          console.log(`  Producer created: ${wine.producerName}`)
        }
      }

      // 4. Parse drinking window
      const { start: drinkStart, end: drinkEnd } = parseDrinkingWindow(wine.drinkingWindow)

      if (dryRun) {
        console.log('  [DRY RUN] Would create:')
        console.log(`    Wine: ${wine.wineName} ${wine.vintage}`)
        console.log(`    Producer: ${wine.producerName}`)
        if (score10) console.log(`    Score: ${score10}/10`)
        successCount++
        continue
      }

      // 5. Create wine (with review data inline)
      const wineData: any = {
        name: wine.wineName,
        slug: generateSlug(`${wine.producerName}-${wine.wineName}-${wine.vintage}`),
        vintage: wine.vintage,
        producer: producerId || undefined,
        region: regionId || undefined,
        priceUsd: wine.price > 0 ? wine.price : undefined,
        score: score10 || undefined,
        tastingNotes: wine.tastingNotes,
        shortSummary: wine.tastingNotes?.split('.')[0] + '.' || '',
        reviewerName: 'WineSaint',
        reviewDate: new Date().toISOString().split('T')[0],
        drinkingWindowStart: drinkStart,
        drinkingWindowEnd: drinkEnd,
      }

      const createdWine = await payload.create({
        collection: 'wines',
        data: wineData,
      })
      console.log(`  Wine created: ${createdWine.id} (score: ${score10})`)

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
  console.log(`Total: ${wines.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Producers created: ${producersCreated}`)
  console.log('='.repeat(70))

  process.exit(0)
}

// CLI
const args = process.argv.slice(2)
const excelPath =
  args.find((a) => a.endsWith('.xlsx') || a.endsWith('.xls')) ||
  '/Users/jordanabraham/Desktop/Master Drink Note Sheet.xlsx'
const dryRun = !args.includes('--live')
const startIndex = args.indexOf('--start-row')
const startRow = startIndex !== -1 ? parseInt(args[startIndex + 1]) : 2
const limitIndex = args.indexOf('--limit')
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

if (args.includes('--help')) {
  console.log('Usage: npx tsx scripts/import-wines-from-excel-payload.ts [excel-file] [options]')
  console.log('')
  console.log('Options:')
  console.log('  --live         Actually import (default is dry run)')
  console.log('  --start-row N  Start from row N (default: 2)')
  console.log('  --limit N      Only process N wines')
  console.log('')
  process.exit(0)
}

importFromExcel(excelPath, dryRun, startRow, limit).catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
