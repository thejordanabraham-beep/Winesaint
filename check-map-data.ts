import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});
async function run() {
  const italy = await client.fetch(`*[_type == 'appellation' && slug.current == 'italy'][0]{ _id, name, level }`);
  console.log('Italy:', italy._id, italy.level);
  
  const children = await client.fetch(`
    *[_type == 'appellation' && parentAppellation._ref == $id] | order(name asc) {
      _id, name, 'slug': slug.current,
      boundaries, centerPoint, totalAcreage, level,
      'childCount': count(*[_type == 'appellation' && parentAppellation._ref == ^._id]),
      'vineyardCount': count(*[_type == 'vineyard' && appellation._ref == ^._id])
    }
  `, { id: italy._id });
  
  console.log('Children count:', children.length);
  for (const c of children) {
    const coords = c.boundaries?.geometry?.coordinates;
    const hasCoords = coords != null;
    const coordLen = Array.isArray(coords) ? coords.length : 0;
    const ringLen = Array.isArray(coords?.[0]) ? coords[0].length : 0;
    console.log((hasCoords ? '✅' : '❌') + ' ' + c.name + ' (' + c.slug + ') rings=' + coordLen + ' pts0=' + ringLen);
  }
}
run().catch(console.error);
