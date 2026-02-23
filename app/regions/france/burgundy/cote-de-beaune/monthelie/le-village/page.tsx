import RegionLayout from '@/components/RegionLayout';

export default function LeVillagePage() {
  return (
    <RegionLayout
      title="Le Village"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="le-village-guide.md"
    />
  );
}
