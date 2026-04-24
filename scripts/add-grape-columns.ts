/**
 * Add missing columns to grapes table directly
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'

const { Client } = pg

async function main() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const client = new Client({ connectionString })

  try {
    await client.connect()
    console.log('Connected to database\n')

    // Check current columns
    const columnsRes = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'grapes'
    `)
    console.log('Current columns:', columnsRes.rows.map(r => r.column_name).join(', '))

    // Add missing columns
    const alterStatements = [
      "ALTER TABLE grapes ADD COLUMN IF NOT EXISTS is_essential BOOLEAN DEFAULT false",
      "ALTER TABLE grapes ADD COLUMN IF NOT EXISTS berry_color TEXT",
    ]

    for (const sql of alterStatements) {
      try {
        await client.query(sql)
        console.log('Executed:', sql.slice(0, 60) + '...')
      } catch (err: any) {
        console.log('Skipped (may already exist):', err.message)
      }
    }

    // Check columns again
    const newColumnsRes = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'grapes'
    `)
    console.log('\nUpdated columns:', newColumnsRes.rows.map(r => r.column_name).join(', '))

  } finally {
    await client.end()
  }
}

main().catch(console.error)
