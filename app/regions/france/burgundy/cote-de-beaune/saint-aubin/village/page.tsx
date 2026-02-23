import RegionLayout from '@/components/RegionLayout';

export default function VillagePage() {
  return (
    <RegionLayout
      title="Village"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="village-vineyard-guide.md"
    />
  );
}
