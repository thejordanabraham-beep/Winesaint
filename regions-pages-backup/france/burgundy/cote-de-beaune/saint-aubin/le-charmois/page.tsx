import RegionLayout from '@/components/RegionLayout';

export default function LeCharmoisPage() {
  return (
    <RegionLayout
      title="Le Charmois"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="le-charmois-guide.md"
    />
  );
}
