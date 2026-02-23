import RegionLayout from '@/components/RegionLayout';

export default function LeCostePage() {
  return (
    <RegionLayout
      title="Le Coste"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="le-coste-guide.md"
    />
  );
}
