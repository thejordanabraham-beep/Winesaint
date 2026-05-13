/**
 * Find guides that don't have matching regions in Payload
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const GUIDES_DIR = path.join(process.cwd(), 'guides')
const PAYLOAD_URL = 'http://localhost:3000'

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
  return data.token
}

async function getAllRegionSlugs(token: string): Promise<Set<string>> {
  const slugs = new Set<string>()
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await fetch(
      `${PAYLOAD_URL}/api/regions?limit=100&page=${page}&depth=0`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    const data = await res.json()

    for (const doc of data.docs || []) {
      slugs.add(doc.slug)
    }

    hasMore = data.hasNextPage || false
    page++
  }

  return slugs
}

async function main() {
  const token = await login()
  console.log('Fetching all region slugs from Payload...')
  const payloadSlugs = await getAllRegionSlugs(token)
  console.log(`Found ${payloadSlugs.size} unique slugs in Payload\n`)

  const guideFiles = fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('-guide.md'))
  console.log(`Found ${guideFiles.length} guide files\n`)

  const unmatched: string[] = []

  for (const file of guideFiles) {
    const slug = file.replace('-guide.md', '')
    if (!payloadSlugs.has(slug)) {
      unmatched.push(slug)
    }
  }

  console.log(`Unmatched guides (${unmatched.length}):\n`)
  unmatched.sort().forEach(slug => console.log(`  ${slug}`))
}

main().catch(console.error)
