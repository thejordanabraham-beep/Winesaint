const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function runIntegrityCheck() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000
  });
  
  try {
    await client.connect();
    console.log('=== COMPREHENSIVE DATA INTEGRITY CHECK ===\n');
    
    // 1. Check for duplicate full_slugs
    console.log('1. DUPLICATE FULL_SLUGS:');
    const dupes = await client.query(`
      SELECT full_slug, COUNT(*) as cnt 
      FROM regions 
      WHERE full_slug IS NOT NULL 
      GROUP BY full_slug 
      HAVING COUNT(*) > 1
    `);
    if (dupes.rows.length === 0) {
      console.log('   ✓ No duplicates found');
    } else {
      console.log('   ✗ Found duplicates:');
      dupes.rows.forEach(r => console.log('     - ' + r.full_slug + ' (' + r.cnt + ' copies)'));
    }
    
    // 2. Check for orphan regions (paths with / but no parent)
    console.log('\n2. ORPHAN REGIONS (paths with / but no parent):');
    const orphans = await client.query(`
      SELECT id, name, full_slug 
      FROM regions 
      WHERE full_slug LIKE '%/%' 
        AND parent_region_id IS NULL
      ORDER BY full_slug
    `);
    if (orphans.rows.length === 0) {
      console.log('   ✓ No orphans found');
    } else {
      console.log('   ✗ Found ' + orphans.rows.length + ' orphans:');
      orphans.rows.slice(0, 10).forEach(r => console.log('     - ' + r.full_slug));
      if (orphans.rows.length > 10) console.log('     ... and ' + (orphans.rows.length - 10) + ' more');
    }
    
    // 3. Check for broken parent relationships
    console.log('\n3. BROKEN PARENT RELATIONSHIPS:');
    const broken = await client.query(`
      SELECT r.id, r.name, r.full_slug, r.parent_region_id,
             p.full_slug as parent_slug
      FROM regions r
      LEFT JOIN regions p ON r.parent_region_id = p.id
      WHERE r.full_slug LIKE '%/%'
        AND r.parent_region_id IS NOT NULL
        AND r.full_slug NOT LIKE p.full_slug || '/%'
    `);
    if (broken.rows.length === 0) {
      console.log('   ✓ All parent relationships valid');
    } else {
      console.log('   ✗ Found ' + broken.rows.length + ' broken relationships:');
      broken.rows.slice(0, 10).forEach(r => {
        console.log('     - ' + r.full_slug + ' → parent: ' + r.parent_slug);
      });
    }
    
    // 4. Check for regions with many children but no sidebarLinks
    console.log('\n4. REGIONS WITH >20 CHILDREN BUT NO SIDEBAR LINKS:');
    const manyChildren = await client.query(`
      SELECT p.id, p.name, p.full_slug, COUNT(c.id) as child_count
      FROM regions p
      LEFT JOIN regions c ON c.parent_region_id = p.id
      GROUP BY p.id, p.name, p.full_slug
      HAVING COUNT(c.id) > 20
      ORDER BY child_count DESC
    `);
    
    let foundMissingSidebar = false;
    for (const region of manyChildren.rows) {
      const links = await client.query(
        'SELECT COUNT(*) as cnt FROM regions_sidebar_links WHERE _parent_id = $1',
        [region.id]
      );
      if (parseInt(links.rows[0].cnt) === 0) {
        console.log('   ⚠ ' + region.full_slug + ' has ' + region.child_count + ' children but no sidebarLinks');
        foundMissingSidebar = true;
      }
    }
    if (!foundMissingSidebar) {
      console.log('   ✓ All regions with >20 children have sidebarLinks set');
    }
    
    // 5. Check countries have children
    console.log('\n5. COUNTRIES WITHOUT CHILDREN:');
    const emptyCountries = await client.query(`
      SELECT r.id, r.name, r.full_slug
      FROM regions r
      WHERE r.level = 'country'
        AND NOT EXISTS (
          SELECT 1 FROM regions c WHERE c.parent_region_id = r.id
        )
    `);
    if (emptyCountries.rows.length === 0) {
      console.log('   ✓ All countries have children');
    } else {
      console.log('   ⚠ Found ' + emptyCountries.rows.length + ' empty countries:');
      emptyCountries.rows.forEach(r => console.log('     - ' + r.name));
    }
    
    // 6. Sidebar links validity
    console.log('\n6. BROKEN SIDEBAR LINKS:');
    const brokenLinks = await client.query(`
      SELECT sl.*, r.full_slug as parent_slug
      FROM regions_sidebar_links sl
      LEFT JOIN regions r ON sl._parent_id = r.id
      LEFT JOIN regions target ON sl.slug = target.full_slug
      WHERE target.id IS NULL
    `);
    if (brokenLinks.rows.length === 0) {
      console.log('   ✓ All sidebar links valid');
    } else {
      console.log('   ✗ Found ' + brokenLinks.rows.length + ' broken links');
    }
    
    // 7. Summary stats
    console.log('\n=== SUMMARY STATISTICS ===');
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN level = 'country' THEN 1 END) as countries,
        COUNT(CASE WHEN level = 'region' THEN 1 END) as regions,
        COUNT(CASE WHEN level = 'subregion' THEN 1 END) as subregions,
        COUNT(CASE WHEN level = 'village' THEN 1 END) as villages,
        COUNT(CASE WHEN level = 'vineyard' THEN 1 END) as vineyards
      FROM regions
    `);
    const s = stats.rows[0];
    console.log('Total regions: ' + s.total);
    console.log('  Countries: ' + s.countries);
    console.log('  Regions: ' + s.regions);
    console.log('  Subregions: ' + s.subregions);
    console.log('  Villages: ' + s.villages);
    console.log('  Vineyards: ' + s.vineyards);
    
    // Wines and producers counts
    const wines = await client.query('SELECT COUNT(*) as cnt FROM wines');
    const producers = await client.query('SELECT COUNT(*) as cnt FROM producers');
    console.log('\nLinked data:');
    console.log('  Wines: ' + wines.rows[0].cnt);
    console.log('  Producers: ' + producers.rows[0].cnt);
    
    console.log('\n=== ALL CHECKS COMPLETE ===');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

runIntegrityCheck();
