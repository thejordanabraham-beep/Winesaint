import RegionLayout from '@/components/RegionLayout';

export default function ClosSaintLandryPage() {
  return (
    <RegionLayout
      title="Clos Saint-Landry"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="clos-saint-landry-guide.md"
    />
  );
}
