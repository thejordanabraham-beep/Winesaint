/**
 * Check which regions are missing content in the database
 *
 * Usage:
 *   npx tsx scripts/check-missing-region-content.ts
 */

import 'dotenv/config'
import pg from 'pg'

const { Client } = pg

// Detect column naming convention
let COLUMN_NAMES = {
  fullSlug: 'full_slug',
  parentRegion: 'parent_region_id'
}

async function detectColumnNames(client: InstanceType<typeof Client>): Promise<void> {
  const result = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'regions'
  `)
  const columns = result.rows.map(r => r.column_name)

  if (columns.includes('fullSlug')) {
    COLUMN_NAMES = {
      fullSlug: 'fullSlug',
      parentRegion: 'parentRegion'
    }
    console.log('Detected camelCase column naming\n')
  } else if (columns.includes('full_slug')) {
    COLUMN_NAMES = {
      fullSlug: 'full_slug',
      parentRegion: 'parent_region_id'
    }
    console.log('Detected snake_case column naming\n')
  } else {
    console.log('Available columns:', columns.join(', '))
    throw new Error('Could not detect column naming')
  }
}

async function main() {
  console.log('Checking for regions with missing content...\n')

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not set in environment')
    process.exit(1)
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database')

  await detectColumnNames(client)

  // Get counts by level
  const countByLevel = await client.query(`
    SELECT level, COUNT(*) as total,
           COUNT(CASE WHEN description IS NULL OR LENGTH(TRIM(COALESCE(description, ''))) = 0 THEN 1 END) as missing
    FROM regions
    GROUP BY level
    ORDER BY
      CASE level
        WHEN 'country' THEN 1
        WHEN 'region' THEN 2
        WHEN 'subregion' THEN 3
        WHEN 'village' THEN 4
        WHEN 'vineyard' THEN 5
        ELSE 6
      END
  `)

  console.log('Content Status by Level:')
  console.log('-'.repeat(50))
  console.log('Level          | Total  | Missing | Complete')
  console.log('-'.repeat(50))

  let totalAll = 0
  let missingAll = 0

  for (const row of countByLevel.rows) {
    const complete = row.total - row.missing
    console.log(
      `${row.level.padEnd(14)} | ${String(row.total).padStart(6)} | ${String(row.missing).padStart(7)} | ${String(complete).padStart(8)}`
    )
    totalAll += parseInt(row.total)
    missingAll += parseInt(row.missing)
  }

  console.log('-'.repeat(50))
  console.log(`${'TOTAL'.padEnd(14)} | ${String(totalAll).padStart(6)} | ${String(missingAll).padStart(7)} | ${String(totalAll - missingAll).padStart(8)}`)
  console.log()

  const fullSlugCol = COLUMN_NAMES.fullSlug

  // Get Burgundy Grand Crus status
  const burgundyGrandCrus = await client.query(`
    SELECT name, "${fullSlugCol}" as full_slug,
           CASE WHEN description IS NULL OR LENGTH(TRIM(COALESCE(description, ''))) = 0 THEN 'Missing' ELSE 'Has Content' END as status
    FROM regions
    WHERE ("${fullSlugCol}" LIKE '%burgundy%' AND level = 'vineyard')
       OR classification = 'grand_cru'
    ORDER BY
      CASE WHEN description IS NULL OR LENGTH(TRIM(COALESCE(description, ''))) = 0 THEN 0 ELSE 1 END,
      name
    LIMIT 50
  `)

  console.log('\nBurgundy Vineyard Status (first 50):')
  console.log('-'.repeat(80))
  for (const row of burgundyGrandCrus.rows) {
    const statusIcon = row.status === 'Missing' ? '✗' : '✓'
    console.log(`${statusIcon} ${row.name.padEnd(35)} | ${row.status}`)
  }

  // Get priority regions missing content
  const priorityMissing = await client.query(`
    SELECT name, "${fullSlugCol}" as full_slug, level, classification
    FROM regions
    WHERE (description IS NULL OR LENGTH(TRIM(COALESCE(description, ''))) = 0)
      AND (
        "${fullSlugCol}" LIKE '%burgundy%'
        OR "${fullSlugCol}" LIKE '%champagne%'
        OR "${fullSlugCol}" LIKE '%mosel%'
        OR "${fullSlugCol}" LIKE '%rheingau%'
        OR classification IN ('grand_cru', 'premier_cru', 'grosse_lage', 'erste_lage')
      )
    ORDER BY
      CASE
        WHEN classification = 'grand_cru' THEN 1
        WHEN classification = 'premier_cru' THEN 2
        WHEN classification = 'grosse_lage' THEN 3
        ELSE 4
      END,
      name
    LIMIT 100
  `)

  console.log(`\nPriority Regions Missing Content (${priorityMissing.rows.length}):`)
  console.log('-'.repeat(80))
  for (const row of priorityMissing.rows) {
    const classTag = row.classification ? ` [${row.classification}]` : ''
    console.log(`  ${row.name}${classTag}`)
    console.log(`    ${row.full_slug}`)
  }

  await client.end()
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
