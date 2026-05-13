/**
 * Create tables and migrate Glossary, Oak, and Rootstock data
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import glossaryData from '../app/data/glossary.json'
import oakData from '../app/data/oak.json'
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

  // Create glossary table
  console.log('Creating glossary table...')
  await client.query(`
    CREATE TABLE IF NOT EXISTS glossary (
      id SERIAL PRIMARY KEY,
      term TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      definition TEXT NOT NULL,
      category TEXT,
      pronunciation TEXT,
      etymology TEXT,
      related_terms JSONB,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Create oak_resources table
  console.log('Creating oak_resources table...')
  await client.query(`
    CREATE TABLE IF NOT EXISTS oak_resources (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      resource_type TEXT NOT NULL,
      description TEXT,
      content TEXT,
      country TEXT,
      region TEXT,
      characteristics TEXT,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Create rootstock_resources table
  console.log('Creating rootstock_resources table...')
  await client.query(`
    CREATE TABLE IF NOT EXISTS rootstock_resources (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      resource_type TEXT NOT NULL,
      description TEXT,
      content TEXT,
      parentage TEXT,
      characteristics TEXT,
      soil_adaptation TEXT,
      drought_tolerance TEXT,
      vigor TEXT,
      updated_at TIMESTAMP DEFAULT NOW(),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Migrate glossary
  console.log('\nMigrating glossary...')
  const terms = (glossaryData as any).terms || []
  let glossaryCount = 0

  for (const term of terms) {
    const slug = createSlug(term.term)
    try {
      await client.query(
        `INSERT INTO glossary (term, slug, definition, category, pronunciation, etymology, related_terms)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO UPDATE SET
           term = $1, definition = $3, category = $4, pronunciation = $5, etymology = $6, related_terms = $7`,
        [
          term.term,
          slug,
          term.definition || '',
          term.category || null,
          term.pronunciation || null,
          term.etymology || null,
          term.related_terms ? JSON.stringify(term.related_terms) : null,
        ]
      )
      glossaryCount++
    } catch (err: any) {
      console.log(`  Skipped: ${term.term} - ${err.message}`)
    }
  }
  console.log(`  Migrated ${glossaryCount} glossary terms`)

  // Migrate oak forests
  console.log('\nMigrating oak forests...')
  const oakSections = (oakData as any).sections || {}
  let oakCount = 0

  // Forests
  for (const region of oakSections.forests?.regions || []) {
    for (const forest of region.forests || []) {
      const slug = forest.id || createSlug(forest.name)
      try {
        await client.query(
          `INSERT INTO oak_resources (name, slug, resource_type, description, content, country, region, characteristics)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (slug) DO UPDATE SET
             name = $1, description = $4, content = $5, country = $6, region = $7, characteristics = $8`,
          [
            forest.name,
            slug,
            'forest',
            forest.description || '',
            forest.characteristics || '',
            region.country || '',
            region.name || '',
            forest.grain || '',
          ]
        )
        oakCount++
      } catch (err: any) {
        console.log(`  Skipped forest: ${forest.name}`)
      }
    }
  }

  // Species
  for (const species of oakSections.species?.types || []) {
    const slug = species.id || createSlug(species.name)
    try {
      await client.query(
        `INSERT INTO oak_resources (name, slug, resource_type, description, content, characteristics)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, content = $5, characteristics = $6`,
        [
          species.name,
          slug,
          'species',
          species.description || '',
          species.characteristics || '',
          species.flavor_profile || '',
        ]
      )
      oakCount++
    } catch (err: any) {
      console.log(`  Skipped species: ${species.name}`)
    }
  }

  // Cooperages
  for (const cooperage of oakSections.cooperage?.cooperages || []) {
    const slug = cooperage.id || createSlug(cooperage.name)
    try {
      await client.query(
        `INSERT INTO oak_resources (name, slug, resource_type, description, country, region)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, country = $5, region = $6`,
        [
          cooperage.name,
          slug,
          'cooperage',
          cooperage.description || cooperage.style || '',
          cooperage.country || '',
          cooperage.location || '',
        ]
      )
      oakCount++
    } catch (err: any) {
      console.log(`  Skipped cooperage: ${cooperage.name}`)
    }
  }

  // Toast levels
  for (const toast of oakSections.toast_levels?.levels || []) {
    const slug = toast.id || createSlug(toast.name)
    try {
      await client.query(
        `INSERT INTO oak_resources (name, slug, resource_type, description, characteristics)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, characteristics = $5`,
        [
          toast.name,
          slug,
          'toast',
          toast.description || '',
          toast.flavor_impact || '',
        ]
      )
      oakCount++
    } catch (err: any) {
      console.log(`  Skipped toast: ${toast.name}`)
    }
  }

  // Barrel formats
  for (const format of oakSections.barrel_formats?.formats || []) {
    const slug = format.id || createSlug(format.name)
    try {
      await client.query(
        `INSERT INTO oak_resources (name, slug, resource_type, description, region)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, region = $5`,
        [
          format.name,
          slug,
          'format',
          format.description || '',
          format.origin || '',
        ]
      )
      oakCount++
    } catch (err: any) {
      console.log(`  Skipped format: ${format.name}`)
    }
  }

  // Regional traditions
  for (const tradition of oakSections.regional_traditions?.traditions || []) {
    const slug = tradition.id || createSlug(tradition.region)
    try {
      await client.query(
        `INSERT INTO oak_resources (name, slug, resource_type, description, region)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, region = $5`,
        [
          tradition.region,
          slug,
          'tradition',
          tradition.oak_tradition || '',
          tradition.region || '',
        ]
      )
      oakCount++
    } catch (err: any) {
      console.log(`  Skipped tradition: ${tradition.region}`)
    }
  }

  console.log(`  Migrated ${oakCount} oak resources`)

  // Migrate rootstock
  console.log('\nMigrating rootstock...')
  const rootstockSections = (rootstockData as any).sections || {}
  let rootstockCount = 0

  // Varieties
  for (const variety of rootstockSections.varieties?.rootstocks || []) {
    const slug = variety.id || createSlug(variety.name)
    try {
      await client.query(
        `INSERT INTO rootstock_resources (name, slug, resource_type, description, parentage, characteristics, soil_adaptation, drought_tolerance, vigor)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, parentage = $5, characteristics = $6, soil_adaptation = $7, drought_tolerance = $8, vigor = $9`,
        [
          variety.name,
          slug,
          'variety',
          variety.description || '',
          variety.parentage || '',
          variety.characteristics || '',
          variety.soil_adaptation || '',
          variety.drought_tolerance || '',
          variety.vigor || '',
        ]
      )
      rootstockCount++
    } catch (err: any) {
      console.log(`  Skipped variety: ${variety.name}`)
    }
  }

  // Species
  for (const species of rootstockSections.species?.species || []) {
    const slug = species.id || createSlug(species.name)
    try {
      await client.query(
        `INSERT INTO rootstock_resources (name, slug, resource_type, description, characteristics)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE SET
           name = $1, description = $4, characteristics = $5`,
        [
          species.name,
          slug,
          'species',
          species.description || '',
          species.characteristics || '',
        ]
      )
      rootstockCount++
    } catch (err: any) {
      console.log(`  Skipped species: ${species.name}`)
    }
  }

  console.log(`  Migrated ${rootstockCount} rootstock resources`)

  // Summary
  console.log('\n=== Migration Complete ===')
  const glossaryCountRes = await client.query('SELECT COUNT(*) FROM glossary')
  const oakCountRes = await client.query('SELECT COUNT(*) FROM oak_resources')
  const rootstockCountRes = await client.query('SELECT COUNT(*) FROM rootstock_resources')

  console.log(`Glossary: ${glossaryCountRes.rows[0].count} terms`)
  console.log(`Oak Resources: ${oakCountRes.rows[0].count} records`)
  console.log(`Rootstock Resources: ${rootstockCountRes.rows[0].count} records`)

  await client.end()
}

main().catch(console.error)
