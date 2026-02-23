import RegionLayout from '@/components/RegionLayout';

export default function LongeroiesPage() {
  return (
    <RegionLayout
      title="Longeroies"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="longeroies-guide.md"
    />
  );
}
