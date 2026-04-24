/**
 * Generate Wine Guide Content for Regions Missing Descriptions
 *
 * This script:
 * 1. Queries the database for regions where description IS NULL or LENGTH(description) = 0
 * 2. For each region, generates detailed wine guide content using Claude's knowledge
 * 3. Updates the database with the generated content
 *
 * Usage:
 *   npx tsx scripts/generate-region-content.ts
 *   npx tsx scripts/generate-region-content.ts --batch-size=20
 *   npx tsx scripts/generate-region-content.ts --dry-run
 *   npx tsx scripts/generate-region-content.ts --priority=burgundy-grand-crus
 *   npx tsx scripts/generate-region-content.ts --limit=5
 *
 * Priority options:
 *   --priority=burgundy-grand-crus  (Romanée-Conti, Chambertin, Montrachet, etc.)
 *   --priority=mosel                (Wehlener Sonnenuhr, Scharzhofberg, etc.)
 *   --priority=champagne            (Le Mesnil-sur-Oger, Ambonnay, Verzenay, etc.)
 *   --priority=all-priority         (All of the above)
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import pg from 'pg'
import Anthropic from '@anthropic-ai/sdk'

const { Client } = pg

// Column name mapping - Payload CMS uses camelCase in config but may convert to snake_case in Postgres
// We'll detect which convention is used
let COLUMN_NAMES = {
  fullSlug: 'full_slug', // default to snake_case
  parentRegion: 'parent_region_id',
  sidebarTitle: 'sidebar_title',
  updatedAt: 'updated_at'
}

// Priority lists for famous vineyards/regions
const BURGUNDY_GRAND_CRUS = [
  'romanee-conti', 'la-tache', 'richebourg', 'romanee-saint-vivant', 'echezeaux',
  'grands-echezeaux', 'chambertin', 'chambertin-clos-de-beze', 'clos-de-vougeot',
  'musigny', 'bonnes-mares', 'corton', 'corton-charlemagne', 'montrachet',
  'batard-montrachet', 'chevalier-montrachet', 'criots-batard-montrachet',
  'bienvenues-batard-montrachet', 'clos-de-la-roche', 'clos-saint-denis',
  'clos-de-tart', 'clos-des-lambrays', 'mazis-chambertin', 'ruchottes-chambertin',
  'charmes-chambertin', 'chapelle-chambertin', 'griotte-chambertin', 'latricieres-chambertin',
  'mazoyeres-chambertin'
]

const MOSEL_TOP_VINEYARDS = [
  'wehlener-sonnenuhr', 'bernkasteler-doctor', 'urziger-wurzgarten',
  'scharzhofberg', 'brauneberger-juffer', 'piesporter-goldtropfchen',
  'graacher-himmelreich', 'zeltinger-sonnenuhr', 'erdener-treppchen',
  'trittenheimer-apotheke', 'maximin-grunhauser-abtsberg'
]

const CHAMPAGNE_GRAND_CRUS = [
  'ambonnay', 'avize', 'ay', 'beaumont-sur-vesle', 'bouzy', 'chouilly',
  'cramant', 'le-mesnil-sur-oger', 'louvois', 'mailly-champagne', 'oger',
  'oiry', 'puisieulx', 'sillery', 'tours-sur-marne', 'verzenay', 'verzy'
]

interface Region {
  id: number
  name: string
  slug: string
  // Support both naming conventions
  full_slug?: string
  fullSlug?: string
  level: string
  country: string
  classification: string | null
  parent_region_id?: number | null
  parentRegion?: number | null
}

interface GenerationResult {
  fullSlug: string
  name: string
  success: boolean
  content?: string
  error?: string
}

async function detectColumnNames(client: InstanceType<typeof Client>): Promise<void> {
  // Check the actual column names in the regions table
  const result = await client.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'regions'
  `)
  const columns = result.rows.map(r => r.column_name)

  // Detect naming convention
  if (columns.includes('fullSlug')) {
    // camelCase convention
    COLUMN_NAMES = {
      fullSlug: 'fullSlug',
      parentRegion: 'parentRegion',
      sidebarTitle: 'sidebarTitle',
      updatedAt: 'updatedAt'
    }
    console.log('Detected camelCase column naming')
  } else if (columns.includes('full_slug')) {
    // snake_case convention
    COLUMN_NAMES = {
      fullSlug: 'full_slug',
      parentRegion: 'parent_region_id',
      sidebarTitle: 'sidebar_title',
      updatedAt: 'updated_at'
    }
    console.log('Detected snake_case column naming')
  } else {
    console.log('Available columns:', columns.join(', '))
    throw new Error('Could not detect column naming convention - full_slug/fullSlug column not found')
  }
}

function getPromptForRegion(region: Region, parentName?: string): string {
  const isVineyard = region.level === 'vineyard'
  const fullSlug = region.full_slug || region.fullSlug || ''
  const isGrandCru = region.classification?.includes('grand_cru') ||
                      fullSlug.includes('grand-cru') ||
                      BURGUNDY_GRAND_CRUS.some(gc => region.slug.includes(gc))
  const isPremierCru = region.classification?.includes('premier_cru')

  // Determine the wine region context from the full_slug
  let regionContext = ''
  const slug = fullSlug.toLowerCase()
  if (slug.includes('burgundy') || slug.includes('bourgogne')) {
    regionContext = 'Burgundy, France'
  } else if (slug.includes('mosel')) {
    regionContext = 'Mosel, Germany'
  } else if (slug.includes('champagne')) {
    regionContext = 'Champagne, France'
  } else if (slug.includes('rheingau')) {
    regionContext = 'Rheingau, Germany'
  } else if (slug.includes('alsace')) {
    regionContext = 'Alsace, France'
  } else if (slug.includes('rhone') || slug.includes('rhône')) {
    regionContext = 'Rhône Valley, France'
  } else if (slug.includes('piedmont') || slug.includes('piemonte') || slug.includes('barolo') || slug.includes('barbaresco')) {
    regionContext = 'Piedmont, Italy'
  } else if (slug.includes('tuscany') || slug.includes('toscana') || slug.includes('brunello') || slug.includes('chianti')) {
    regionContext = 'Tuscany, Italy'
  } else if (slug.includes('bordeaux')) {
    regionContext = 'Bordeaux, France'
  } else if (slug.includes('loire')) {
    regionContext = 'Loire Valley, France'
  } else if (slug.includes('pfalz')) {
    regionContext = 'Pfalz, Germany'
  } else if (slug.includes('nahe')) {
    regionContext = 'Nahe, Germany'
  } else {
    regionContext = region.country
  }

  if (isVineyard || isGrandCru || isPremierCru) {
    // Vineyard/climat level template
    const classificationNote = isGrandCru
      ? `This is a Grand Cru vineyard - one of the most prestigious classifications.`
      : isPremierCru
      ? `This is a Premier Cru vineyard - a highly regarded classification just below Grand Cru.`
      : ''

    return `You are an expert wine writer with deep knowledge of wine regions, vineyards, and terroir. Write a comprehensive, authoritative guide for the vineyard/climat "${region.name}" located in ${regionContext}.

${classificationNote}

IMPORTANT: Base your content on established wine knowledge. Be specific and accurate. Include real data about:
- The vineyard's exact location, size, and geographical features
- Soil composition and geological history
- Microclimate characteristics
- Typical wine styles and characteristics from this site
- Notable producers who own parcels here

The content should follow this markdown format:

# ${region.name}

[Opening paragraph about location and significance - explain why this vineyard is notable and what makes it distinctive. For famous sites, mention historical significance.]

## Geography and Terroir

[Detailed information about:
- Location within the appellation (which commune, which slope)
- Elevation in meters
- Aspect/orientation (e.g., east-facing, south-southeast)
- Slope gradient (gentle, moderate, steep)
- Total size in hectares
- Position on the slope (piedmont, mid-slope, hilltop)]

## Soil Composition

[Geological details:
- Bedrock type (e.g., Bathonian limestone, Bajocian marl, Jurassic formations)
- Topsoil composition (clay content, limestone fragments, iron content)
- Soil depth and layer structure
- Drainage characteristics
- How the soil specifically influences wine character]

## Wine Character

[Detailed description of wines from this site:
- Primary aromas and flavors typical of this terroir
- Secondary characteristics that develop with age
- Tannin structure and texture
- Acidity profile
- Body and weight
- Aging potential (specific timeframes)
- How wines from this site differ from neighboring vineyards]

## Notable Producers

[List the most important producers with holdings in this vineyard:
- Domain/producer name
- Approximate parcel size if known
- Brief description of their style and reputation
Include at least 3-5 producers for Grand Cru sites]

${isGrandCru ? `## Classification and History

[Details about:
- When this vineyard received Grand Cru status
- Historical significance and famous past owners
- Notable vintages
- Any interesting historical facts]` : ''}

${isPremierCru ? `## Classification

[Information about:
- Premier Cru status within its commune
- How it compares to neighboring Premier Crus
- Whether it's considered among the best Premier Crus]` : ''}

Write approximately 1500-2500 words. Use proper markdown formatting. Be authoritative and specific - this is for a professional wine reference site.`
  } else {
    // Region/sub-region level template
    return `You are an expert wine writer with deep knowledge of wine regions worldwide. Write a comprehensive, authoritative guide for the wine region "${region.name}" in ${regionContext}.

IMPORTANT: Base your content on established wine knowledge. Be specific and accurate. Include real data about the region's geography, climate, grape varieties, wine styles, and notable producers.

The content should follow this markdown format:

# ${region.name} Wine Region

[Overview paragraph: What makes this region significant? What is it best known for? What should a wine enthusiast know about this place?]

## Geography

[Comprehensive details:
- Location and boundaries (neighboring regions, geographical markers)
- Climate type (continental, maritime, Mediterranean, alpine, etc.)
- Key geographical features (rivers, mountains, valleys, slopes)
- Elevation range
- Total vineyard area in hectares
- Soil types found in the region]

## Climate

[Detailed climate information:
- Average temperatures (growing season, annual)
- Rainfall patterns
- Sunshine hours
- Frost risk
- Harvest timing
- How climate influences wine style]

## Grape Varieties

[Main varieties grown:
- Principal red varieties with percentage of plantings if known
- Principal white varieties with percentage of plantings if known
- Indigenous or rare varieties unique to this region
- Brief description of what each variety contributes]

## Wine Styles

[Types of wines produced:
- Red wines: style, characteristics, aging potential
- White wines: style, characteristics, aging potential
- Other styles (rosé, sparkling, dessert, fortified)
- Classification/appellation system (AOC, DOC, AVA, etc.)
- Quality levels within the region]

## Sub-regions

[Key areas within the region:
- Name and brief description of each significant sub-region or commune
- What distinguishes each area's wines
- Any special classifications or crus]

## Notable Producers

[List 5-10 important producers:
- Producer name
- What they're known for
- Brief description of their style or significance]

## History

[Historical context:
- When viticulture began in the region
- Important developments and milestones
- Historical challenges (phylloxera, wars, etc.)
- Recent developments]

Write approximately 1500-2500 words. Use proper markdown formatting. Be authoritative and specific - this is for a professional wine reference site.`
  }
}

async function generateContentWithClaude(
  anthropic: Anthropic,
  region: Region,
  parentName?: string
): Promise<string> {
  const prompt = getPromptForRegion(region, parentName)

  console.log(`  Generating content for: ${region.name} (${region.level})...`)

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  })

  // Extract text content
  const textContent = message.content.find(block => block.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response')
  }

  return textContent.text
}

function getPrioritySlugPatterns(priority: string): string[] {
  switch (priority) {
    case 'burgundy-grand-crus':
      return BURGUNDY_GRAND_CRUS
    case 'mosel':
      return MOSEL_TOP_VINEYARDS
    case 'champagne':
      return CHAMPAGNE_GRAND_CRUS
    case 'all-priority':
      return [...BURGUNDY_GRAND_CRUS, ...MOSEL_TOP_VINEYARDS, ...CHAMPAGNE_GRAND_CRUS]
    default:
      return []
  }
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const batchSizeArg = args.find(a => a.startsWith('--batch-size='))
  const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : 20
  const priorityArg = args.find(a => a.startsWith('--priority='))
  const priority = priorityArg ? priorityArg.split('=')[1] : null
  const limitArg = args.find(a => a.startsWith('--limit='))
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null

  console.log('='.repeat(60))
  console.log('Wine Region Content Generator')
  console.log('='.repeat(60))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  console.log(`Batch size: ${batchSize}`)
  if (priority) console.log(`Priority: ${priority}`)
  if (limit) console.log(`Limit: ${limit}`)
  console.log()

  // Initialize database connection
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set')
    console.error('Make sure .env.local contains DATABASE_URL')
    process.exit(1)
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  console.log('Connected to database')

  // Detect column naming convention
  await detectColumnNames(client)

  // Initialize Anthropic client
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set')
    process.exit(1)
  }

  const anthropic = new Anthropic()
  console.log('Initialized Anthropic client')
  console.log()

  try {
    const fullSlugCol = COLUMN_NAMES.fullSlug
    const parentRegionCol = COLUMN_NAMES.parentRegion

    // Build query for regions with missing content
    let query = `
      SELECT id, name, slug, "${fullSlugCol}" as full_slug, level, country, classification, "${parentRegionCol}" as parent_region_id
      FROM regions
      WHERE description IS NULL OR LENGTH(TRIM(COALESCE(description, ''))) = 0
    `

    // If priority is set, order by priority patterns first
    const priorityPatterns = priority ? getPrioritySlugPatterns(priority) : []

    if (priorityPatterns.length > 0) {
      const patternCases = priorityPatterns.map((p, i) =>
        `WHEN slug LIKE '%${p}%' THEN ${i}`
      ).join('\n          ')

      query += `
      ORDER BY
        CASE
          ${patternCases}
          ELSE 999
        END,
        CASE level
          WHEN 'vineyard' THEN 1
          WHEN 'village' THEN 2
          WHEN 'subregion' THEN 3
          WHEN 'region' THEN 4
          WHEN 'country' THEN 5
          ELSE 6
        END,
        name
      `
    } else {
      // Default ordering: prioritize vineyards and famous regions
      query += `
      ORDER BY
        CASE level
          WHEN 'vineyard' THEN 1
          WHEN 'village' THEN 2
          WHEN 'subregion' THEN 3
          WHEN 'region' THEN 4
          WHEN 'country' THEN 5
          ELSE 6
        END,
        CASE
          WHEN "${fullSlugCol}" LIKE '%burgundy%grand%' THEN 1
          WHEN "${fullSlugCol}" LIKE '%burgundy%premier%' THEN 2
          WHEN "${fullSlugCol}" LIKE '%burgundy%' THEN 3
          WHEN "${fullSlugCol}" LIKE '%champagne%' THEN 4
          WHEN "${fullSlugCol}" LIKE '%mosel%' THEN 5
          WHEN "${fullSlugCol}" LIKE '%rheingau%' THEN 6
          ELSE 10
        END,
        name
      `
    }

    // Apply limit
    const queryLimit = limit || batchSize
    query += ` LIMIT ${queryLimit}`

    console.log('Querying for regions with missing content...')
    const result = await client.query(query)
    const regions: Region[] = result.rows

    console.log(`Found ${regions.length} regions needing content`)
    console.log()

    if (regions.length === 0) {
      console.log('No regions need content generation.')
      await client.end()
      return
    }

    // Show what will be processed
    console.log('Regions to process:')
    regions.forEach((r, i) => {
      const slug = r.full_slug || r.fullSlug || ''
      console.log(`  ${i + 1}. ${r.name} (${r.level}) - ${slug}`)
    })
    console.log()

    if (dryRun) {
      console.log('DRY RUN - No content will be generated or saved')
      await client.end()
      return
    }

    // Process in batches
    const results: GenerationResult[] = []

    for (let i = 0; i < regions.length; i++) {
      const region = regions[i]
      console.log(`\n[${i + 1}/${regions.length}] Processing: ${region.name}`)

      try {
        // Get parent name if exists
        let parentName: string | undefined
        const parentId = region.parent_region_id
        if (parentId) {
          const parentResult = await client.query(
            'SELECT name FROM regions WHERE id = $1',
            [parentId]
          )
          parentName = parentResult.rows[0]?.name
        }

        // Generate content
        const content = await generateContentWithClaude(anthropic, region, parentName)

        // Update database - use the detected column name for fullSlug
        const fullSlugCol = COLUMN_NAMES.fullSlug
        const updatedAtCol = COLUMN_NAMES.updatedAt
        const regionFullSlug = region.full_slug || region.fullSlug

        await client.query(
          `UPDATE regions SET description = $1, "${updatedAtCol}" = NOW() WHERE "${fullSlugCol}" = $2`,
          [content, regionFullSlug]
        )

        results.push({
          fullSlug: regionFullSlug!,
          name: region.name,
          success: true,
          content: content.substring(0, 200) + '...'
        })

        console.log(`  ✓ Updated ${region.name}`)

        // Rate limiting - wait between requests
        if (i < regions.length - 1) {
          console.log('  Waiting 2 seconds before next request...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }

      } catch (error: any) {
        console.error(`  ✗ Error processing ${region.name}: ${error.message}`)
        results.push({
          fullSlug: region.full_slug || region.fullSlug || '',
          name: region.name,
          success: false,
          error: error.message
        })
      }

      // Log progress every 10 regions
      if ((i + 1) % 10 === 0) {
        const successCount = results.filter(r => r.success).length
        console.log(`\n--- Progress: ${i + 1}/${regions.length} (${successCount} successful) ---\n`)
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('Generation Complete')
    console.log('='.repeat(60))

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    console.log(`Total processed: ${results.length}`)
    console.log(`Successful: ${successCount}`)
    console.log(`Failed: ${failCount}`)

    if (failCount > 0) {
      console.log('\nFailed regions:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`)
      })
    }

    // Count remaining regions
    const remainingResult = await client.query(`
      SELECT COUNT(*) as count FROM regions
      WHERE description IS NULL OR LENGTH(TRIM(description)) = 0
    `)
    console.log(`\nRegions still needing content: ${remainingResult.rows[0].count}`)

  } finally {
    await client.end()
    console.log('\nDatabase connection closed')
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
