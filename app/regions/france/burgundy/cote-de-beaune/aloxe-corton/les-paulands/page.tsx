import RegionLayout from '@/components/RegionLayout';

export default function LesPaulandsPage() {
  return (
    <RegionLayout
      title="Les Paulands"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="les-paulands-guide.md"
    />
  );
}
