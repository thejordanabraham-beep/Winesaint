import fs from 'fs';
import path from 'path';

const vineyards = [
  { slug: 'chapelle-chambertin', name: 'Chapelle-Chambertin' },
  { slug: 'charmes-chambertin', name: 'Charmes-Chambertin' },
  { slug: 'griotte-chambertin', name: 'Griotte-Chambertin' },
  { slug: 'latricieres-chambertin', name: 'Latricières-Chambertin' },
  { slug: 'mazis-chambertin', name: 'Mazis-Chambertin' },
  { slug: 'mazoyeres-chambertin', name: 'Mazoyères-Chambertin' },
  { slug: 'ruchottes-chambertin', name: 'Ruchottes-Chambertin' },
  { slug: 'clos-saint-jacques', name: 'Clos Saint-Jacques' },
  { slug: 'les-cazetiers', name: 'Les Cazetiers' },
  { slug: 'lavaux-saint-jacques', name: 'Lavaux Saint-Jacques' },
];

const basePath = '/Users/jordanabraham/wine-reviews/app/regions/france/burgundy/cote-de-nuits/gevrey-chambertin';

vineyards.forEach(vineyard => {
  const functionName = vineyard.name.replace(/[^a-zA-Z]/g, '');

  const content = `import RegionLayout from '@/components/RegionLayout';
import { client } from '@/lib/sanity/client';

async function getClimatData(slug: string) {
  const query = \`*[_type == "climat" && slug.current == $slug][0] {
    _id,
    name,
    classification,
    acreage,
    hectares: acreage,
    soilTypes,
    aspect,
    slope,
    elevationRange,
    producers[]->{
      name,
      "slug": slug.current
    }
  }\`;

  return await client.fetch(query, { slug });
}

export default async function ${functionName}VineyardPage() {
  const climatData = await getClimatData('${vineyard.slug}');

  return (
    <RegionLayout
      title="${vineyard.name}"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      contentFile="${vineyard.slug}-vineyard-guide.md"
      vineyardData={climatData ? {
        classification: climatData.classification,
        acreage: climatData.acreage,
        hectares: climatData.hectares,
        soilTypes: climatData.soilTypes,
        aspect: climatData.aspect,
        slope: climatData.slope,
        elevationRange: climatData.elevationRange,
        producers: climatData.producers || []
      } : undefined}
    />
  );
}
`;

  const filePath = path.join(basePath, vineyard.slug, 'page.tsx');
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
});

console.log('All vineyard pages created!');
