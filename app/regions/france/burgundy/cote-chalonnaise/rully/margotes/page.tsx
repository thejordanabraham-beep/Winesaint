import RegionLayout from '@/components/RegionLayout';

export default function MargotsPage() {
  return (
    <RegionLayout
      title="Margotés"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="margotes-guide.md"
    />
  );
}
