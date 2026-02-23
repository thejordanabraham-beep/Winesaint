import RegionLayout from '@/components/RegionLayout';

export default function AgneuxPage() {
  return (
    <RegionLayout
      title="Agneux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="agneux-guide.md"
    />
  );
}
