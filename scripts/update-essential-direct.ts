/**
 * Update is_essential directly in database
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import grapesData from '../app/data/grapes.json'
import overridesData from '../app/data/grape-overrides.json'

const { Client } = pg

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database\n')

  const overrides = overridesData as any
  const grapes = (grapesData as any).grapes

  // Find essential grapes
  const essentialSlugs: string[] = []

  for (const grape of grapes) {
    let isEssential = grape.is_essential

    // Check if override exists
    if (overrides.essential_overrides?.hasOwnProperty(grape.id)) {
      isEssential = overrides.essential_overrides[grape.id]
    }

    if (isEssential) {
      essentialSlugs.push(createSlug(grape.name))
    }
  }

  console.log(`Found ${essentialSlugs.length} essential grapes to update\n`)

  // Update in batches
  if (essentialSlugs.length > 0) {
    const placeholders = essentialSlugs.map((_, i) => `$${i + 1}`).join(', ')
    const query = `UPDATE grapes SET is_essential = true WHERE slug IN (${placeholders})`

    const result = await client.query(query, essentialSlugs)
    console.log(`Updated ${result.rowCount} grapes to essential`)
  }

  // Verify
  const verifyRes = await client.query("SELECT COUNT(*) as count FROM grapes WHERE is_essential = true")
  console.log(`\nVerification: ${verifyRes.rows[0].count} essential grapes in database`)

  await client.end()
}

main().catch(console.error)
