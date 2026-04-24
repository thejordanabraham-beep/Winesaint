import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
const { Client } = pg

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  // Check a few regions have content
  const result = await client.query(`
    SELECT full_slug, name,
           CASE WHEN description IS NOT NULL THEN LENGTH(description) ELSE 0 END as content_length
    FROM regions
    WHERE description IS NOT NULL AND LENGTH(description) > 100
    ORDER BY LENGTH(description) DESC
    LIMIT 10
  `)

  console.log('Regions with content:')
  for (const row of result.rows) {
    console.log(`  ${row.full_slug}: ${row.content_length} chars`)
  }

  // Check how many have content
  const countRes = await client.query(`
    SELECT
      COUNT(*) as total,
      COUNT(CASE WHEN description IS NOT NULL AND LENGTH(description) > 100 THEN 1 END) as with_content
    FROM regions
  `)

  console.log(`\nTotal regions: ${countRes.rows[0].total}`)
  console.log(`With content: ${countRes.rows[0].with_content}`)

  await client.end()
}

main().catch(console.error)
