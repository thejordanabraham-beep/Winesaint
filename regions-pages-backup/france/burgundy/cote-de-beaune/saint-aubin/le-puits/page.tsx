import RegionLayout from '@/components/RegionLayout';

export default function LePuitsPage() {
  return (
    <RegionLayout
      title="Le Puits"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="le-puits-guide.md"
    />
  );
}
