/**
 * Update berry_color directly in database
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import grapesData from '../app/data/grapes.json'

const { Client } = pg

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database\n')

  const grapes = (grapesData as any).grapes
  let updated = 0

  for (const grape of grapes) {
    const slug = createSlug(grape.name)
    const berryColor = grape.berry_color

    if (berryColor) {
      await client.query(
        "UPDATE grapes SET berry_color = $1 WHERE slug = $2",
        [berryColor, slug]
      )
      updated++
    }
  }

  console.log(`Updated ${updated} grapes with berry_color`)

  await client.end()
}

main().catch(console.error)
