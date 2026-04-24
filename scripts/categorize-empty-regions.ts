import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import pg from 'pg'
const { Client } = pg

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  const result = await client.query(`
    SELECT full_slug, name, level
    FROM regions
    WHERE description IS NULL OR LENGTH(description) = 0
    ORDER BY full_slug
  `)

  const producers: string[] = []
  const orphans: string[] = []
  const minorCountries: string[] = []
  const realRegions: string[] = []

  const producerPatterns = [
    'domaine-', 'chateau-', '-estate', 'penfolds', 'screaming-eagle', 'harlan',
    'opus-one', 'caymus', 'almaviva', 'vega-sicilia', 'pingus', 'catena',
    'achaval', 'zuccardi', 'cloudy-bay', 'felton-road', 'rippon', 'mount-difficulty',
    'niepoort', 'quinta-', 'taylors', 'cullen', 'leeuwin', 'vasse-felix',
    'yeringberg', 'mount-mary', 'henschke', 'torbreck', 'fx-pichler', 'knoll',
    'prager', 'clos-erasmus', 'clos-mogador', 'alvaro-palacios', 'pesquera',
    'cvne', 'marques-de-', 'vina-tondonia', 'la-rioja-alta', 'fromm', 'greywacke',
    'stags-leap-wine', 'vina-cobos', 'domane-wachau'
  ]

  const minorCountryList = [
    'albania', 'bosnia-herzegovina', 'bulgaria', 'canada', 'croatia', 'cyprus',
    'czech-republic', 'england', 'georgia', 'hungary', 'israel', 'lebanon',
    'mexico', 'moldova', 'montenegro', 'north-macedonia', 'romania', 'russia',
    'serbia', 'slovakia', 'slovenia', 'switzerland', 'turkey', 'ukraine'
  ]

  for (const row of result.rows) {
    const slug = row.full_slug as string

    // Check if it's a producer
    const isProducer = producerPatterns.some(p => slug.includes(p))

    if (isProducer) {
      producers.push(slug)
    } else if (slug.indexOf('/') === -1) {
      // No slash = orphaned or minor country
      if (minorCountryList.includes(slug)) {
        minorCountries.push(slug)
      } else {
        orphans.push(slug)
      }
    } else {
      realRegions.push(slug)
    }
  }

  console.log('=== BREAKDOWN OF', result.rows.length, 'EMPTY REGIONS ===\n')
  console.log('Producer pages (wrong table):', producers.length)
  console.log('Minor countries (stubs):', minorCountries.length)
  console.log('Orphaned slugs (no parent):', orphans.length)
  console.log('Real regions needing content:', realRegions.length)

  console.log('\n--- Orphaned slugs ---')
  orphans.forEach(o => console.log('  ' + o))

  console.log('\n--- Real regions needing content ---')
  realRegions.forEach(r => console.log(r))

  await client.end()
}

main().catch(console.error)
