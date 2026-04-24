/**
 * Update grapes in database with full markdown content (direct DB access)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import grapesData from '../app/data/grapes.json'

const { Client } = pg

interface Grape {
  name: string
  original_rewritten_content?: string
}

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database\n')

  const grapes = (grapesData as any).grapes as Grape[]
  console.log(`Updating ${grapes.length} grapes with full content...\n`)

  let updated = 0
  let skipped = 0

  for (const grape of grapes) {
    const slug = createSlug(grape.name)
    const content = grape.original_rewritten_content || ''

    if (!content) {
      skipped++
      continue
    }

    try {
      const result = await client.query(
        'UPDATE grapes SET content = $1 WHERE slug = $2',
        [content, slug]
      )

      if (result.rowCount && result.rowCount > 0) {
        updated++
        if (updated % 50 === 0) {
          console.log(`  Updated ${updated} grapes...`)
        }
      } else {
        skipped++
      }
    } catch (err: any) {
      console.log(`  Error updating ${grape.name}: ${err.message}`)
    }
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`)

  // Verify
  const countRes = await client.query("SELECT COUNT(*) FROM grapes WHERE content IS NOT NULL AND content != ''")
  console.log(`Grapes with content: ${countRes.rows[0].count}`)

  await client.end()
}

main().catch(console.error)
