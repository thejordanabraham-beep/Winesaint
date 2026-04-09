import RegionLayout from '@/components/RegionLayout';

export default async function BeaumesDeVenisePage() {
  return (
    <RegionLayout
      title="Beaumes-de-Venise"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="beaumes-de-venise-guide.md"
    />
  );
}
