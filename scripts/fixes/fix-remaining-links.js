const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const fixes = [
    // Burgundy Mâconnais
    { parent: 'france/burgundy/maconnais', slugs: ['pouilly-fuisse', 'pouilly-vinzelles', 'pouilly-loche', 'saint-veran', 'vire-clesse'] },
    // Aloxe-Corton
    { parent: 'france/burgundy/cote-de-beaune/aloxe-corton', slugs: ['charlemagne'] },
    // Argentina Mendoza
    { parent: 'argentina/mendoza', slugs: ['lujan-de-cuyo', 'maipu', 'san-martin', 'san-rafael', 'uco-valley'] },
    // Australia Barossa
    { parent: 'australia/barossa-valley', slugs: ['eden-valley', 'greenock', 'lyndoch', 'marananga', 'nuriootpa', 'rowland-flat', 'tanunda'] },
    // Australia Yarra
    { parent: 'australia/yarra-valley', slugs: ['central-yarra', 'lower-yarra', 'upper-yarra'] },
    // Canada
    { parent: 'canada', slugs: ['okanagan-valley', 'niagara-peninsula', 'british-columbia', 'ontario'] },
    // England
    { parent: 'england', slugs: ['sussex', 'kent', 'hampshire'] },
    // Mexico
    { parent: 'mexico', slugs: ['valle-de-guadalupe', 'baja-california'] },
    // Portugal Douro
    { parent: 'portugal/douro', slugs: ['baixo-corgo', 'cima-corgo', 'douro-superior'] },
    // Spain Ribera del Duero
    { parent: 'spain/ribera-del-duero', slugs: ['aranda-de-duero', 'gumiel-de-izan', 'la-horra', 'penafiel', 'pesquera-de-duero', 'quintanilla-de-onesimo', 'roa-de-duero', 'san-esteban-de-gormaz', 'sotillo-de-la-ribera', 'valbuena-de-duero'] },
    // Italy Puglia
    { parent: 'italy/puglia', slugs: ['copertino'] },
    // Oregon Walla Walla
    { parent: 'united-states/oregon/walla-walla-valley', slugs: ['rocks-district-milton-freewater'] },
  ];

  for (const fix of fixes) {
    const parentRes = await client.query(`SELECT id FROM regions WHERE full_slug = $1`, [fix.parent]);
    const parentId = parentRes.rows[0]?.id;

    if (!parentId) {
      console.log('Parent not found:', fix.parent);
      continue;
    }

    for (const slug of fix.slugs) {
      const targetSlug = fix.parent + '/' + slug;

      // Check if it already exists at the correct path
      const exists = await client.query(`SELECT id FROM regions WHERE full_slug = $1`, [targetSlug]);
      if (exists.rows[0]) {
        continue;
      }

      // Find it anywhere else
      const found = await client.query(`SELECT id, name, full_slug FROM regions WHERE slug = $1`, [slug]);
      if (found.rows[0]) {
        await client.query(`
          UPDATE regions SET parent_region_id = $1, full_slug = $2 WHERE id = $3
        `, [parentId, targetSlug, found.rows[0].id]);
        console.log('Moved', found.rows[0].name, 'to', targetSlug);
      } else {
        console.log('Not found:', slug, '(would go to', targetSlug + ')');
      }
    }
  }

  // Fix Alsace typo - update the sidebarLink slug
  const alsaceRes = await client.query(`
    UPDATE regions_sidebar_links
    SET slug = 'zinnkoepfle'
    WHERE slug = 'zinnkoeple'
    RETURNING *
  `);
  if (alsaceRes.rowCount > 0) {
    console.log('Fixed Alsace typo: zinnkoeple -> zinnkoepfle');
  }

  await client.end();
  console.log('Done!');
}

main().catch(console.error);
