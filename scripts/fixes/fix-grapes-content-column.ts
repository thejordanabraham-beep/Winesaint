/**
 * Fix grapes content column and update with markdown content
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

  // Check current column type
  const colRes = await client.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'grapes' AND column_name = 'content'
  `)
  console.log('Current content column type:', colRes.rows[0]?.data_type || 'not found')

  // Alter column to TEXT if it's JSON
  if (colRes.rows[0]?.data_type === 'jsonb' || colRes.rows[0]?.data_type === 'json') {
    console.log('Altering column from JSON to TEXT...')
    await client.query('ALTER TABLE grapes ALTER COLUMN content TYPE TEXT')
    console.log('Done.\n')
  }

  // Now update with content
  const grapes = (grapesData as any).grapes as Grape[]
  console.log(`Updating ${grapes.length} grapes with full content...\n`)

  let updated = 0

  for (const grape of grapes) {
    const slug = createSlug(grape.name)
    const content = grape.original_rewritten_content || ''

    if (!content) continue

    const result = await client.query(
      'UPDATE grapes SET content = $1 WHERE slug = $2',
      [content, slug]
    )

    if (result.rowCount && result.rowCount > 0) {
      updated++
    }
  }

  console.log(`Updated ${updated} grapes with content`)

  // Verify
  const countRes = await client.query("SELECT COUNT(*) FROM grapes WHERE content IS NOT NULL AND content != ''")
  console.log(`Grapes with content in database: ${countRes.rows[0].count}`)

  await client.end()
}

main().catch(console.error)
