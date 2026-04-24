/**
 * Batch sync guide content to Payload via REST API
 */

import dotenv from 'dotenv'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Load .env.local
dotenv.config({ path: '.env.local' })
import path from 'path'

const GUIDES_DIR = path.join(process.cwd(), 'guides')
const PAYLOAD_URL = 'http://localhost:3000'

interface PayloadRegion {
  id: number
  slug: string
  fullSlug: string
  description?: string
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

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`)
  }

  const data = await res.json()
  return data.token
}

async function getAllRegions(token: string): Promise<PayloadRegion[]> {
  const regions: PayloadRegion[] = []
  let page = 1
  let hasMore = true

  console.log('Fetching regions from Payload...')

  while (hasMore) {
    const res = await fetch(
      `${PAYLOAD_URL}/api/regions?limit=100&page=${page}&depth=0`,
      {
        headers: { Authorization: `JWT ${token}` },
      }
    )

    const data = await res.json()
    if (data.docs) {
      regions.push(...data.docs)
      if (page % 5 === 0) {
        console.log(`  Fetched ${regions.length} regions...`)
      }
    }

    hasMore = data.hasNextPage || false
    page++
  }

  console.log(`Total: ${regions.length} regions\n`)
  return regions
}

async function updateRegion(
  id: number,
  description: string,
  token: string
): Promise<boolean> {
  const res = await fetch(`${PAYLOAD_URL}/api/regions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ description }),
  })

  return res.ok
}

async function main() {
  console.log('Batch syncing guide content to Payload...\n')

  // Login
  console.log('Logging in...')
  const token = await login()
  console.log('Authenticated\n')

  // Get all regions
  const regions = await getAllRegions(token)

  // Build a map of fullSlug -> region for faster lookup
  const regionMap = new Map<string, PayloadRegion>()
  const slugMap = new Map<string, PayloadRegion>()

  for (const region of regions) {
    if (region.fullSlug) {
      regionMap.set(region.fullSlug, region)
    }
    if (region.slug) {
      // Store by slug too, but fullSlug takes precedence
      if (!slugMap.has(region.slug)) {
        slugMap.set(region.slug, region)
      }
    }
  }

  // Get all guide files
  const guideFiles = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('-guide.md'))
  console.log(`Found ${guideFiles.length} guide files\n`)

  let updated = 0
  let skipped = 0
  let notFound = 0
  let errors = 0

  for (const file of guideFiles) {
    const slug = file.replace('-guide.md', '')
    const content = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf-8')

    // Find the region by slug
    const region = slugMap.get(slug)

    if (!region) {
      notFound++
      continue
    }

    // Check if content is different (compare first 100 chars to avoid full comparison)
    const currentStart = (region.description || '').slice(0, 100)
    const newStart = content.slice(0, 100)

    if (currentStart === newStart) {
      skipped++
      continue
    }

    // Update the region
    try {
      const success = await updateRegion(region.id, content, token)
      if (success) {
        updated++
        if (updated % 20 === 0) {
          console.log(`  Updated ${updated} regions...`)
        }
      } else {
        console.log(`  Failed: ${slug}`)
        errors++
      }
    } catch (err) {
      console.log(`  Error updating ${slug}:`, err)
      errors++
    }
  }

  console.log('\nSync complete!')
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (unchanged): ${skipped}`)
  console.log(`  No matching region: ${notFound}`)
  console.log(`  Errors: ${errors}`)
}

main().catch(err => {
  console.error('Sync failed:', err)
  process.exit(1)
})
