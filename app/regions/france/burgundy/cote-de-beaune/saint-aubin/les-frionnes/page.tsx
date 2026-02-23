import RegionLayout from '@/components/RegionLayout';

export default function LesFrionnesPage() {
  return (
    <RegionLayout
      title="Les Frionnes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-frionnes-guide.md"
    />
  );
}
