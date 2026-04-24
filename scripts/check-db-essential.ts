import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import pg from 'pg'

const { Client } = pg

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  const res = await client.query("SELECT name, is_essential FROM grapes WHERE is_essential = true LIMIT 5")
  console.log('Essential grapes in DB:', res.rows)
  console.log('Total:', res.rowCount)

  await client.end()
}

main().catch(console.error)
