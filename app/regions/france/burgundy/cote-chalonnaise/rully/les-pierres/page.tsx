import RegionLayout from '@/components/RegionLayout';

export default function LesPierresPage() {
  return (
    <RegionLayout
      title="Les Pierres"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="les-pierres-guide.md"
    />
  );
}
