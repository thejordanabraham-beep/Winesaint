import RegionLayout from '@/components/RegionLayout';

export default function LesSaussillesPage() {
  return (
    <RegionLayout
      title="Les Saussilles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-saussilles-guide.md"
    />
  );
}
