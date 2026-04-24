/**
 * Migrate grapes from local JSON to Payload CMS
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import grapesData from '../app/data/grapes.json'
import overridesData from '../app/data/grape-overrides.json'

const PAYLOAD_URL = 'http://localhost:3000'

interface Grape {
  id: string
  name: string
  berry_color: string
  is_essential: boolean
  principal_synonyms?: string
  level_1: {
    description: string
    key_characteristics?: string[]
    typical_flavors?: string[]
    major_regions?: string[]
  }
  level_2?: {
    climate_preferences?: string
    soil_preferences?: string
    vine_training_systems?: string[]
    harvest_considerations?: string
    oak_usage?: string
    aging_potential?: string
    food_pairings?: string[]
    serve_temperature?: string
    decanting?: string
  }
  level_3?: any
}

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function getColor(berryColor: string): 'red' | 'white' | 'pink' {
  const color = berryColor.toLowerCase()
  if (color.includes('black') || color.includes('red') || color.includes('blue')) {
    return 'red'
  }
  if (color.includes('pink') || color.includes('grey') || color.includes('gray')) {
    return 'pink'
  }
  return 'white'
}

function cleanFlavors(flavors: string[]): string[] {
  const cleaned: string[] = []
  for (const item of flavors) {
    const parts = item.split(/\n/).map(s => s.trim()).filter(Boolean)
    for (const part of parts) {
      const clean = part.replace(/^[-–—•]\s*/, '').trim()
      if (clean && clean.length < 100) {
        cleaned.push(clean)
      }
    }
  }
  return cleaned
}

function cleanRegions(regions: string[]): string[] {
  return regions.map(r => r.replace(/^[-–—•]\s*/, '').trim()).filter(Boolean)
}

function applyOverrides(grape: Grape): Grape {
  const overrides = overridesData as any
  const modified = { ...grape }

  if (overrides.name_overrides?.[grape.name]) {
    modified.name = overrides.name_overrides[grape.name]
  }

  if (overrides.essential_overrides?.hasOwnProperty(grape.id)) {
    modified.is_essential = overrides.essential_overrides[grape.id]
  }

  return modified
}

async function login(): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD,
    }),
  })
  const data = await res.json()
  if (!data.token) throw new Error('Login failed')
  return data.token
}

async function createGrape(grape: Grape, token: string): Promise<boolean> {
  const modifiedGrape = applyOverrides(grape)
  const slug = createSlug(modifiedGrape.name)

  // Build the full content as markdown
  let content = `# ${modifiedGrape.name}\n\n`
  content += (modifiedGrape.level_1?.description || '') + '\n\n'

  if (modifiedGrape.level_1?.key_characteristics?.length) {
    content += '## Key Characteristics\n\n'
    modifiedGrape.level_1?.key_characteristics?.forEach(c => {
      content += `- ${c}\n`
    })
    content += '\n'
  }

  if (modifiedGrape.level_2?.climate_preferences) {
    content += '## Climate & Growing Conditions\n\n'
    content += modifiedGrape.level_2.climate_preferences + '\n\n'
  }

  if (modifiedGrape.level_2?.soil_preferences) {
    content += '## Soil Preferences\n\n'
    content += modifiedGrape.level_2.soil_preferences + '\n\n'
  }

  if (modifiedGrape.level_2?.oak_usage) {
    content += '## Oak Usage\n\n'
    content += modifiedGrape.level_2.oak_usage + '\n\n'
  }

  if (modifiedGrape.level_2?.aging_potential) {
    content += '## Aging Potential\n\n'
    content += modifiedGrape.level_2.aging_potential + '\n\n'
  }

  if (modifiedGrape.level_2?.food_pairings?.length) {
    content += '## Food Pairings\n\n'
    modifiedGrape.level_2.food_pairings.forEach(p => {
      const clean = p.replace(/^[-–—•]\s*/, '').trim()
      if (clean) content += `- ${clean}\n`
    })
    content += '\n'
  }

  // Build aliases from synonyms
  const aliases = modifiedGrape.principal_synonyms
    ? modifiedGrape.principal_synonyms.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10)
    : []

  // Build flavor profile
  const flavors = modifiedGrape.level_1?.typical_flavors
    ? cleanFlavors(modifiedGrape.level_1.typical_flavors).slice(0, 15)
    : []

  // Clean regions
  const regions = modifiedGrape.level_1?.major_regions
    ? cleanRegions(modifiedGrape.level_1.major_regions).slice(0, 20)
    : []

  // Prepare Payload data
  const payloadData = {
    name: modifiedGrape.name,
    slug,
    color: getColor(modifiedGrape.berry_color),
    berryColor: modifiedGrape.berry_color,
    isEssential: modifiedGrape.is_essential,
    description: (modifiedGrape.level_1?.description || '').slice(0, 500),
    content: content,
    aliases: aliases.map(a => ({ alias: a })),
    flavorProfile: flavors.map(f => ({ flavor: f })),
    majorRegions: regions.map(r => ({ region: r })),
  }

  try {
    // Check if grape exists
    const existingRes = await fetch(
      `${PAYLOAD_URL}/api/grapes?where[slug][equals]=${slug}&limit=1`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    const existing = await existingRes.json()

    if (existing.docs?.length > 0) {
      // Update existing
      const res = await fetch(`${PAYLOAD_URL}/api/grapes/${existing.docs[0].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(payloadData),
      })
      return res.ok
    } else {
      // Create new
      const res = await fetch(`${PAYLOAD_URL}/api/grapes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(payloadData),
      })
      return res.ok
    }
  } catch (err) {
    console.error(`Error with grape ${modifiedGrape.name}:`, err)
    return false
  }
}

async function main() {
  console.log('Migrating grapes to Payload...\n')

  const token = await login()
  console.log('Authenticated\n')

  const grapes = (grapesData as any).grapes as Grape[]
  console.log(`Found ${grapes.length} grapes to migrate\n`)

  let success = 0
  let failed = 0

  for (const grape of grapes) {
    const ok = await createGrape(grape, token)
    if (ok) {
      success++
      if (success % 20 === 0) {
        console.log(`  Migrated ${success} grapes...`)
      }
    } else {
      failed++
      console.log(`  Failed: ${grape.name}`)
    }
  }

  console.log('\nMigration complete!')
  console.log(`  Success: ${success}`)
  console.log(`  Failed: ${failed}`)
}

main().catch(console.error)
