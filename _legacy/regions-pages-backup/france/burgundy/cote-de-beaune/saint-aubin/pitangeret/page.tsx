import RegionLayout from '@/components/RegionLayout';

export default function PitangeretPage() {
  return (
    <RegionLayout
      title="Pitangeret"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="pitangeret-vineyard-guide.md"
    />
  );
}
