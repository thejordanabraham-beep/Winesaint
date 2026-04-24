/**
 * Move orphaned guides to backup folder then delete them
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const GUIDES_DIR = path.join(process.cwd(), 'guides')
const BACKUP_DIR = path.join(process.cwd(), 'guides-orphaned-backup')
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

  let moved = 0
  let deleted = 0

  for (const file of guideFiles) {
    const slug = file.replace('-guide.md', '')
    if (!payloadSlugs.has(slug)) {
      const srcPath = path.join(GUIDES_DIR, file)
      const backupPath = path.join(BACKUP_DIR, file)

      // Copy to backup
      fs.copyFileSync(srcPath, backupPath)
      moved++

      // Delete original
      fs.unlinkSync(srcPath)
      deleted++
    }
  }

  console.log(`Moved ${moved} orphaned guides to backup folder`)
  console.log(`Deleted ${deleted} orphaned guides from guides/`)
  console.log(`\nRemaining guides: ${fs.readdirSync(GUIDES_DIR).filter(f => f.endsWith('-guide.md')).length}`)
}

main().catch(console.error)
