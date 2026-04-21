import RegionLayout from '@/components/RegionLayout';

export default function LesCastetsPage() {
  return (
    <RegionLayout
      title="Les Castets"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-castets-guide.md"
    />
  );
}
