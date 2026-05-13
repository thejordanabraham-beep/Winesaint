import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PAYLOAD_URL = 'http://localhost:3000';

// [keepId, deleteId, keepName] — keep the version with proper French formatting
const CHAMPAGNE_PAIRS: [number, number, string][] = [
  [440, 1224, 'Ambonnay'],
  [441, 1258, 'Avenay-Val-d\'Or'],
  [442, 1211, 'Avize'],
  [444, 1225, 'Beaumont-sur-Vesle'],
  [446, 1226, 'Bezannes'],
  [448, 1260, 'Bisseuil'],
  [449, 1227, 'Bouzy'],
  [450, 1228, 'Chamery'],
  [451, 1261, 'Champillon'],
  [452, 1229, 'Chigny-les-Roses'],
  [453, 1213, 'Chouilly'],
  [454, 1230, 'Coligny'],
  [455, 1231, 'Cormontreuil'],
  [459, 1232, 'Coulommes-la-Montagne'],
  [460, 1214, 'Cramant'],
  [464, 1233, 'Écueil'],
  [465, 1216, 'Étrechy'],
  [466, 1217, 'Grauves'],
  [467, 1264, 'Hautvillers'],
  [469, 1218, 'Le Mesnil-sur-Oger'],
  [470, 1235, 'Les Mesneux'],
  [471, 1236, 'Louvois'],
  [472, 1237, 'Ludes'],
  [473, 1238, 'Mailly-Champagne'],
  [474, 1265, 'Mareuil-sur-Aÿ'],
  [476, 1239, 'Montbré'],
  [477, 1266, 'Mutigny'],
  [482, 1241, 'Puisieulx'],
  [483, 1242, 'Rilly-la-Montagne'],
  [485, 1244, 'Sermiers'],
  [486, 1245, 'Sillery'],
  [487, 1246, 'Taissy'],
  [491, 1249, 'Trois-Puits'],
  [493, 1250, 'Vaudemange'],
  [494, 1221, 'Vertus'],
  [495, 1251, 'Verzenay'],
  [496, 1252, 'Verzy'],
  [497, 1253, 'Villedommange'],
  [498, 1222, 'Villeneuve-Renneville'],
  [499, 1254, 'Villers-Allerand'],
  [501, 1256, 'Villers-Marmery'],
  [502, 1223, 'Voipreux'],
  [503, 1257, 'Vrigny'],
];

const OTHER_PAIRS: [number, number, string][] = [
  [520, 1291, 'Muscadet'],
  [524, 1297, 'Touraine'],
];

async function main() {
  const loginRes = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.PAYLOAD_ADMIN_EMAIL, password: process.env.PAYLOAD_ADMIN_PASSWORD }),
  });
  const { token } = await loginRes.json();

  const DRY_RUN = process.argv.includes('--dry-run');
  if (DRY_RUN) console.log('DRY RUN\n');

  const allPairs = [...CHAMPAGNE_PAIRS, ...OTHER_PAIRS];
  let totalMoved = 0;
  let totalDeleted = 0;
  let errors = 0;

  for (const [keepId, deleteId, name] of allPairs) {
    // Count wines in each region
    const keepRes = await fetch(`${PAYLOAD_URL}/api/wines?where[region][equals]=${keepId}&limit=1&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const keepData = await keepRes.json();
    const keepCount = keepData.totalDocs;

    const delRes = await fetch(`${PAYLOAD_URL}/api/wines?where[region][equals]=${deleteId}&limit=1&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const delData = await delRes.json();
    const delCount = delData.totalDocs;

    // Also check if any regions have this as parent
    const childRes = await fetch(`${PAYLOAD_URL}/api/regions?where[parentRegion][equals]=${deleteId}&limit=1&depth=0`, {
      headers: { Authorization: `JWT ${token}` },
    });
    const childData = await childRes.json();
    const childCount = childData.totalDocs;

    console.log(`${name}: keep=${keepId} (${keepCount} wines), delete=${deleteId} (${delCount} wines, ${childCount} child regions)`);

    if (delCount > 0) {
      // Reassign wines from delete → keep
      let page = 1;
      while (true) {
        const winesRes = await fetch(`${PAYLOAD_URL}/api/wines?where[region][equals]=${deleteId}&limit=100&page=${page}&depth=0`, {
          headers: { Authorization: `JWT ${token}` },
        });
        const winesData = await winesRes.json();
        if (!winesData.docs || winesData.docs.length === 0) break;

        for (const w of winesData.docs) {
          if (!DRY_RUN) {
            const patchRes = await fetch(`${PAYLOAD_URL}/api/wines/${w.id}`, {
              method: 'PATCH',
              headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ region: keepId }),
            });
            if (!patchRes.ok) {
              console.log(`  ✗ Wine ${w.id} failed`);
              errors++;
              continue;
            }
          }
          totalMoved++;
        }

        if (!winesData.hasNextPage) break;
        page++;
      }
      console.log(`  → Moved ${delCount} wines`);
    }

    // Reassign child regions
    if (childCount > 0) {
      let page = 1;
      while (true) {
        const childrenRes = await fetch(`${PAYLOAD_URL}/api/regions?where[parentRegion][equals]=${deleteId}&limit=100&page=${page}&depth=0`, {
          headers: { Authorization: `JWT ${token}` },
        });
        const childrenData = await childrenRes.json();
        if (!childrenData.docs || childrenData.docs.length === 0) break;

        for (const r of childrenData.docs) {
          if (!DRY_RUN) {
            await fetch(`${PAYLOAD_URL}/api/regions/${r.id}`, {
              method: 'PATCH',
              headers: { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ parentRegion: keepId }),
            });
          }
          console.log(`  → Reparented child region ${r.id} "${r.name}"`);
        }

        if (!childrenData.hasNextPage) break;
        page++;
      }
    }

    // Delete the duplicate region
    if (!DRY_RUN) {
      const deleteRes = await fetch(`${PAYLOAD_URL}/api/regions/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `JWT ${token}` },
      });
      if (deleteRes.ok) {
        totalDeleted++;
      } else {
        console.log(`  ✗ Failed to delete region ${deleteId}`);
        errors++;
      }
    } else {
      totalDeleted++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Regions merged: ${totalDeleted}`);
  console.log(`Wines reassigned: ${totalMoved}`);
  console.log(`Errors: ${errors}`);
}

main().catch(console.error);
