import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
const { Client } = pg

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  // Find regions with template/generic content
  const result = await client.query(`
    SELECT full_slug, name, LENGTH(description) as content_length
    FROM regions
    WHERE description ILIKE '%documentation remains limited%'
       OR description ILIKE '%detailed information about this%'
       OR description ILIKE '%comprehensive documentation%'
       OR description ILIKE '%further research is needed%'
       OR description ILIKE '%information about this vineyard%'
       OR description ILIKE '%specific details about%'
    ORDER BY full_slug
  `)

  console.log(`Found ${result.rows.length} regions with template content:\n`)
  for (const row of result.rows) {
    console.log(`${row.full_slug}`)
  }

  await client.end()
}

main().catch(console.error)
