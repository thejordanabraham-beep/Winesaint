/**
 * Fix rootstock migration
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import rootstockData from '../app/data/rootstock.json'

const { Client } = pg

function createSlug(name: string): string {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database\n')

  const data = rootstockData as any
  let count = 0

  // Varieties from sections.rootstocks.varieties
  const varieties = data.sections?.rootstocks?.varieties || []
  console.log(`Found ${varieties.length} rootstock varieties`)

  for (const variety of varieties) {
    const slug = variety.id || createSlug(variety.name)
    const parentage = typeof variety.parentage === 'object'
      ? variety.parentage.type || ''
      : variety.parentage || ''

    try {
      await client.query(
        `INSERT INTO rootstock_resources (name, slug, resource_type, description, parentage, characteristics, vigor)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, parentage = $5, characteristics = $6, vigor = $7`,
        [
          variety.full_name || variety.name,
          slug,
          'variety',
          variety.description || variety.characteristics?.description || '',
          parentage,
          JSON.stringify(variety.characteristics || {}),
          variety.vigor || variety.characteristics?.vigor || '',
        ]
      )
      count++
    } catch (err: any) {
      console.log(`  Skipped: ${variety.name} - ${err.message}`)
    }
  }

  // Species from sections.species.species
  const species = data.sections?.species?.species || []
  console.log(`\nFound ${species.length} rootstock species`)

  for (const sp of species) {
    const slug = sp.id || createSlug(sp.name)
    try {
      await client.query(
        `INSERT INTO rootstock_resources (name, slug, resource_type, description, characteristics)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, characteristics = $5`,
        [
          sp.name,
          slug,
          'species',
          sp.description || '',
          sp.characteristics || '',
        ]
      )
      count++
    } catch (err: any) {
      console.log(`  Skipped: ${sp.name} - ${err.message}`)
    }
  }

  // Regional info from sections.regions.regions
  const regions = data.sections?.regions?.regions || []
  console.log(`\nFound ${regions.length} rootstock regions`)

  for (const region of regions) {
    const slug = region.id || createSlug(region.name)
    try {
      await client.query(
        `INSERT INTO rootstock_resources (name, slug, resource_type, description, soil_adaptation)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, soil_adaptation = $5`,
        [
          region.name,
          slug,
          'region',
          region.overview || '',
          region.common_rootstocks || '',
        ]
      )
      count++
    } catch (err: any) {
      console.log(`  Skipped: ${region.name} - ${err.message}`)
    }
  }

  console.log(`\nMigrated ${count} rootstock resources total`)

  const countRes = await client.query('SELECT COUNT(*) FROM rootstock_resources')
  console.log(`Total in database: ${countRes.rows[0].count}`)

  await client.end()
}

main().catch(console.error)
