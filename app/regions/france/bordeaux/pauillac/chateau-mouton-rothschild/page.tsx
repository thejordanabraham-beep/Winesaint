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

export default async function ChteauMoutonRothschildVineyardPage() {
  const climatData = await getClimatData('chateau-mouton-rothschild');

  return (
    <RegionLayout
      title="Château Mouton Rothschild"
      level="vineyard"
      parentRegion="france/bordeaux/pauillac"
      contentFile="chateau-mouton-rothschild-guide.md"
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
