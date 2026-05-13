import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
const { Client } = pg

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  // Check a sample of the updated regions
  const result = await client.query(`
    SELECT full_slug, name, LENGTH(description) as content_length,
           SUBSTRING(description, 1, 200) as preview
    FROM regions
    WHERE full_slug IN (
      'austria/kremstal/oberfeld',
      'france/burgundy/cote-de-beaune/puligny-montrachet/clavoillon',
      'italy/piedmont/barolo/monforte-d-alba/mosconi'
    )
  `)

  console.log('='.repeat(60))
  console.log('Verification of Updated Regions')
  console.log('='.repeat(60))

  for (const row of result.rows) {
    console.log(`\nRegion: ${row.name}`)
    console.log(`Full slug: ${row.full_slug}`)
    console.log(`Content length: ${row.content_length} characters`)
    console.log(`Preview: ${row.preview}...`)
    console.log('-'.repeat(40))
  }

  // Also check these don't have template phrases anymore
  const templateCheck = await client.query(`
    SELECT full_slug, name
    FROM regions
    WHERE full_slug IN (
      'austria/kremstal/oberfeld',
      'austria/thermenregion/roter-berg',
      'austria/wachau/1000-eimerberg',
      'austria/wien/seidenhaus',
      'france/burgundy/cote-chalonnaise/montagny/cruzille',
      'france/burgundy/cote-chalonnaise/montagny/les-coeres',
      'france/burgundy/cote-de-beaune/puligny-montrachet/clavoillon',
      'france/burgundy/cote-de-beaune/saint-aubin/derriere-chez-edouard',
      'france/burgundy/cote-de-beaune/saint-aubin/en-creot',
      'france/burgundy/cote-de-nuits/fixin/les-hervelets',
      'france/burgundy/cote-de-nuits/marsannay/les-favieres',
      'france/champagne/coulommes-la-montagne',
      'france/champagne/montagne-de-reims/coulommes-la-montagne',
      'france/roussillon/collioure',
      'france/southern-rhone/beaumes-de-venise',
      'germany/mosel/mittelmosel/piesporter-domherr',
      'germany/wurttemberg/roter-berg',
      'italy/piedmont/barbaresco/barbaresco/cavanna',
      'italy/piedmont/barbaresco/barbaresco/faset',
      'italy/piedmont/barbaresco/treiso/vallegrande',
      'italy/piedmont/barolo/monforte-d-alba/mosconi',
      'italy/piedmont/barolo/novello/sottocastello-di-novello',
      'italy/piedmont/barolo/verduno/ascheri'
    )
    AND (
      description ILIKE '%documentation remains limited%'
      OR description ILIKE '%limited documentation%'
      OR description ILIKE '%documentation is limited%'
    )
  `)

  console.log(`\nRegions still containing template phrases: ${templateCheck.rowCount}`)
  if (templateCheck.rowCount && templateCheck.rowCount > 0) {
    for (const row of templateCheck.rows) {
      console.log(`  - ${row.name} (${row.full_slug})`)
    }
  } else {
    console.log('  All template phrases have been replaced!')
  }

  await client.end()
}

main().catch(console.error)
