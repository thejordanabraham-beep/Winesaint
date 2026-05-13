/**
 * Migrate oak, rootstock, and bottles guides to Payload
 * Stores full JSON content in a resource_guides table
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import oakData from '../app/data/oak.json'
import rootstockData from '../app/data/rootstock.json'
import bottlesData from '../app/data/bottles.json'

const { Client } = pg

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database\n')

  // Create resource_guides table
  console.log('Creating resource_guides table...')
  await client.query(`
    CREATE TABLE IF NOT EXISTS resource_guides (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Insert/update guides
  const guides = [
    { slug: 'oak', title: 'The Oak Guide', content: oakData },
    { slug: 'rootstock', title: 'The Rootstock Guide', content: rootstockData },
    { slug: 'bottles', title: 'Wine Bottle Guide', content: bottlesData },
  ]

  for (const guide of guides) {
    console.log(`Saving ${guide.title}...`)
    await client.query(`
      INSERT INTO resource_guides (slug, title, content)
      VALUES ($1, $2, $3)
      ON CONFLICT (slug) DO UPDATE SET
        title = $2,
        content = $3,
        updated_at = NOW()
    `, [guide.slug, guide.title, JSON.stringify(guide.content)])
  }

  // Verify
  const countRes = await client.query('SELECT slug, title FROM resource_guides')
  console.log('\nGuides in database:')
  for (const row of countRes.rows) {
    console.log(`  - ${row.slug}: ${row.title}`)
  }

  await client.end()
  console.log('\nDone!')
}

main().catch(console.error)
