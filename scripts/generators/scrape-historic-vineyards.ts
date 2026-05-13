/**
 * Scrape Historic Vineyard Society registry
 */

import * as cheerio from 'cheerio';

const VINEYARDS_URL = 'https://historicvineyardsociety.org/vineyards';

interface Vineyard {
  name: string;
  appellationName: string;
  regionName: string;
  classification: string;
  plantingDecade?: string;
  status?: string;
}

async function scrapeHistoricVineyards() {
  console.log('🔍 Fetching Historic Vineyard Society registry...\n');

  try {
    const response = await fetch(VINEYARDS_URL);
    const html = await response.text();
    const $ = cheerio.load(html);

    const vineyards: Vineyard[] = [];

    // Find all vineyard entries in the table
    $('table tbody tr').each((index, element) => {
      const $row = $(element);
      const cells = $row.find('td');

      if (cells.length >= 3) {
        const name = $(cells[0]).text().trim();
        const ava = $(cells[1]).text().trim();
        const decade = $(cells[2]).text().trim();

        // Determine status from row class or other indicators
        const rowClass = $row.attr('class') || '';
        let status = 'registered';
        if (rowClass.includes('memoriam') || rowClass.includes('memorial')) {
          status = 'in_memoriam';
        } else if (rowClass.includes('unregistered')) {
          status = 'unregistered';
        }

        if (name && ava) {
          vineyards.push({
            name: name,
            appellationName: ava,
            regionName: 'California',
            classification: 'historic_vineyard',
            plantingDecade: decade || undefined,
            status: status
          });
        }
      }
    });

    console.log(`📊 Found ${vineyards.length} historic vineyards\n`);

    // Write to JSON file
    const fs = await import('fs');
    const path = await import('path');
    const outputPath = path.join(__dirname, '../data/usa-california-historic-vineyards.json');

    // Format for import script (simplified structure)
    const formattedData = vineyards.map(v => ({
      name: v.name,
      appellationName: v.appellationName,
      regionName: v.regionName,
      classification: v.classification
    }));

    fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
    console.log(`✅ Saved to: ${outputPath}\n`);
    console.log(`📈 Total vineyards: ${formattedData.length}`);

  } catch (error) {
    console.error('❌ Error scraping vineyards:', error);
    process.exit(1);
  }
}

scrapeHistoricVineyards()
  .then(() => {
    console.log('\n✅ Scraping complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Scraping failed:', error);
    process.exit(1);
  });
