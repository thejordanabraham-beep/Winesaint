/**
 * Sync guide content to Payload via local API
 * Bypasses CLI initialization issues
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const GUIDES_DIR = path.join(process.cwd(), 'guides')
const DATABASE_URI = process.env.DATABASE_URI || process.env.MONGODB_URI || ''

// We'll use fetch to hit the Payload API directly
const PAYLOAD_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

async function getAuthToken(): Promise<string | null> {
  // Check for API key first
  const apiKey = process.env.PAYLOAD_API_KEY
  if (apiKey) return apiKey

  // Try to login
  const email = process.env.PAYLOAD_ADMIN_EMAIL
  const password = process.env.PAYLOAD_ADMIN_PASSWORD

  if (!email || !password) {
    console.log('No API key or admin credentials found in env')
    return null
  }

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    return data.token || null
  } catch (err) {
    console.error('Login failed:', err)
    return null
  }
}

async function getAllRegions(token: string | null): Promise<any[]> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `JWT ${token}`
  }

  const regions: any[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await fetch(`${PAYLOAD_URL}/api/regions?limit=100&page=${page}&depth=0`, {
      headers,
    })
    const data = await res.json()

    if (data.docs) {
      regions.push(...data.docs)
    }

    hasMore = data.hasNextPage || false
    page++
  }

  return regions
}

async function updateRegion(id: string, description: string, token: string | null): Promise<boolean> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `JWT ${token}`
  }

  try {
    const res = await fetch(`${PAYLOAD_URL}/api/regions/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ description }),
    })
    return res.ok
  } catch (err) {
    return false
  }
}

function getGuideFilename(slug: string): string {
  return `${slug}-guide.md`
}

async function syncGuides() {
  console.log('Syncing guide content to Payload...\n')
  console.log(`Payload URL: ${PAYLOAD_URL}`)

  // Get auth token
  const token = await getAuthToken()
  console.log(`Auth: ${token ? 'authenticated' : 'anonymous'}\n`)

  // Get all regions from Payload
  console.log('Fetching regions from Payload...')
  const regions = await getAllRegions(token)
  console.log(`Found ${regions.length} regions in Payload\n`)

  let updated = 0
  let skipped = 0
  let notFound = 0

  for (const region of regions) {
    const slug = region.slug || region.fullSlug?.split('/').pop()
    if (!slug) {
      skipped++
      continue
    }

    // Try to find the guide file
    const guideFile = getGuideFilename(slug)
    const guidePath = path.join(GUIDES_DIR, guideFile)

    try {
      const content = await fs.promises.readFile(guidePath, 'utf-8')

      // Check if content is different
      if (region.description === content) {
        skipped++
        continue
      }

      // Update the region
      const success = await updateRegion(region.id, content, token)
      if (success) {
        updated++
        if (updated % 50 === 0) {
          console.log(`  Updated ${updated} regions...`)
        }
      } else {
        console.log(`  Failed to update: ${slug}`)
      }
    } catch (err) {
      // Guide file not found
      notFound++
    }
  }

  console.log('\nSync complete!')
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (unchanged): ${skipped}`)
  console.log(`  No guide file: ${notFound}`)
}

syncGuides().catch(err => {
  console.error('Sync failed:', err)
  process.exit(1)
})
