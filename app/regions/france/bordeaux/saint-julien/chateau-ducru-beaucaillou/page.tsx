import RegionLayout from '@/components/RegionLayout';
import { client } from '@/lib/sanity/client';

async function getClimatData(slug: string) {
  const query = `*[_type == "climat" && slug.current == $slug][0] {
    _id,
    name,
    classification,
    acreage,
    soilTypes,
    aspect,
    slope,
    elevationRange,
    producers[]->{
      name,
      "slug": slug.current
    }
  }`;

  return await client.fetch(query, { slug });
}

export default async function ChteauDucruBeaucaillouVineyardPage() {
  const climatData = await getClimatData('chateau-ducru-beaucaillou');

  return (
    <RegionLayout
      title="Château Ducru-Beaucaillou"
      level="vineyard"
      parentRegion="france/bordeaux/saint-julien"
      contentFile="chateau-ducru-beaucaillou-guide.md"
      vineyardData={climatData ? {
        classification: climatData.classification,
        acreage: climatData.acreage,
        soilTypes: climatData.soilTypes,
        aspect: climatData.aspect,
        slope: climatData.slope,
        elevationRange: climatData.elevationRange,
        producers: climatData.producers || []
      } : undefined}
    />
  );
}
