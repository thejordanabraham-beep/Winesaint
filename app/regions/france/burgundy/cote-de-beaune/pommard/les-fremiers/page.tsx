import RegionLayout from '@/components/RegionLayout';

export default function LesFremiersPage() {
  return (
    <RegionLayout
      title="Les Fremiers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-fremiers-guide.md"
    />
  );
}
