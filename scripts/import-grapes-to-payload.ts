/**
 * Grape Import Script for Payload CMS
 *
 * Imports grapes from the existing grape guide (app/data/grapes.json)
 * into Payload's grapes collection.
 *
 * Usage:
 *   npm run dev  # Start server in another terminal
 *   npx tsx scripts/import-grapes-to-payload.ts [--live] [--limit N]
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const API_BASE = process.env.PAYLOAD_API_URL || 'http://localhost:3000/api'

interface GrapeGuideEntry {
  id: string
  name: string
  berry_color: string
  is_essential: boolean
  principal_synonyms?: string
  level_1?: {
    description?: string
    key_characteristics?: string[]
    typical_flavors?: string[]
    major_regions?: string[]
  }
  level_2?: {
    full_description?: string
    history?: string
    viticulture?: string
  }
}

interface GrapeGuide {
  total_grapes: number
  essential_grapes: number
  grapes: GrapeGuideEntry[]
}

/**
 * Make API request to Payload
 */
async function api(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
 * Check if grape exists
 */
async function grapeExists(slug: string): Promise<boolean> {
  try {
    const result = await api(`/grapes?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`)
    return (result.docs?.length || 0) > 0
  } catch {
    return false
  }
}

/**
 * Create a grape document
 */
async function createGrape(data: Record<string, any>): Promise<any> {
  return api('/grapes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Generate slug from grape name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 96)
}

/**
 * Convert berry_color to Payload color enum
 */
function mapColor(berryColor: string): 'red' | 'white' | 'pink' {
  const lower = berryColor?.toLowerCase() || ''
  if (lower === 'black' || lower === 'red' || lower === 'noir') return 'red'
  if (lower === 'white' || lower === 'green' || lower === 'blanc') return 'white'
  if (lower === 'pink' || lower === 'rose' || lower === 'rosé' || lower === 'grey' || lower === 'gris') return 'pink'
  // Default based on common patterns
  return 'red'
}

/**
 * Title case a name (CHARDONNAY -> Chardonnay)
 */
function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Parse synonyms string into array
 */
function parseAliases(synonyms?: string): { alias: string }[] {
  if (!synonyms) return []
  return synonyms
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .slice(0, 10) // Limit to 10 aliases
    .map(alias => ({ alias }))
}

/**
 * Parse flavor profile into array
 */
function parseFlavorProfile(flavors?: string[]): { flavor: string }[] {
  if (!flavors || !Array.isArray(flavors)) return []
  return flavors
    .slice(0, 10) // Limit to 10 flavors
    .map(flavor => ({ flavor }))
}

async function importGrapes(dryRun: boolean, limit?: number) {
  console.log('GRAPE IMPORT PIPELINE')
  console.log('='.repeat(70))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`)
  console.log(`API: ${API_BASE}`)
  if (limit) console.log(`Limit: ${limit}`)
  console.log('')

  // Test API connection
  if (!dryRun) {
    console.log('Testing API connection...')
    try {
      await api('/grapes?limit=1')
      console.log('API connected\n')
    } catch (err: any) {
      console.error(`Cannot connect to Payload API at ${API_BASE}`)
      console.error('Make sure the dev server is running: npm run dev')
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  }

  // Load grape guide
  const guidePath = path.join(process.cwd(), 'app/data/grapes.json')
  if (!fs.existsSync(guidePath)) {
    console.error(`Grape guide not found: ${guidePath}`)
    process.exit(1)
  }

  const guide: GrapeGuide = JSON.parse(fs.readFileSync(guidePath, 'utf-8'))
  let grapes = guide.grapes

  if (limit) grapes = grapes.slice(0, limit)

  console.log(`Found ${guide.total_grapes} grapes in guide`)
  console.log(`Essential grapes: ${guide.essential_grapes}`)
  console.log(`Processing: ${grapes.length} grapes\n`)

  let successCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (let i = 0; i < grapes.length; i++) {
    const grape = grapes[i]
    const name = titleCase(grape.name)
    const slug = generateSlug(grape.name)

    console.log(`[${i + 1}/${grapes.length}] ${name}`)

    // Check if already exists
    if (!dryRun) {
      const exists = await grapeExists(slug)
      if (exists) {
        console.log('  Skipped (already exists)')
        skippedCount++
        continue
      }
    }

    const color = mapColor(grape.berry_color)
    const aliases = parseAliases(grape.principal_synonyms)
    const flavorProfile = parseFlavorProfile(grape.level_1?.typical_flavors)
    const description = grape.level_1?.description || ''

    if (dryRun) {
      console.log(`  Color: ${color}`)
      console.log(`  Aliases: ${aliases.length}`)
      console.log(`  Flavors: ${flavorProfile.length}`)
      console.log(`  Description: ${description.substring(0, 60)}...`)
      successCount++
      continue
    }

    try {
      const payload: Record<string, any> = {
        name,
        slug,
        color,
        description: description.substring(0, 500), // Limit description length
        flavorProfile,
      }

      // Add aliases if present
      if (aliases.length > 0) {
        payload.aliases = aliases
      }

      const result = await createGrape(payload)
      const grapeId = result.doc?.id || result.id
      console.log(`  Created: ${grapeId}`)
      successCount++

    } catch (error: any) {
      console.error(`  ERROR: ${error.message}`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('IMPORT SUMMARY')
  console.log('='.repeat(70))
  console.log(`Total processed: ${grapes.length}`)
  console.log(`Successful: ${successCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log(`Errors: ${errorCount}`)
}

// CLI
const args = process.argv.slice(2)
const dryRun = !args.includes('--live')
const limitIndex = args.indexOf('--limit')
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : undefined

if (args.includes('--help')) {
  console.log('Grape Import Pipeline')
  console.log('')
  console.log('Usage: npx tsx scripts/import-grapes-to-payload.ts [options]')
  console.log('')
  console.log('Options:')
  console.log('  --live     Actually import (default is dry run)')
  console.log('  --limit N  Only process first N grapes')
  console.log('')
  console.log('IMPORTANT: The dev server must be running (npm run dev)')
  process.exit(0)
}

importGrapes(dryRun, limit).catch(err => {
  console.error('Import failed:', err)
  process.exit(1)
})
