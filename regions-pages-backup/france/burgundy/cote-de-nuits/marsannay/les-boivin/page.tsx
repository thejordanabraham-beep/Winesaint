import RegionLayout from '@/components/RegionLayout';

export default function LesBoivinPage() {
  return (
    <RegionLayout
      title="Les Boivin"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="les-boivin-guide.md"
    />
  );
}
