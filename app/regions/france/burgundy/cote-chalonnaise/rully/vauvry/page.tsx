import RegionLayout from '@/components/RegionLayout';

export default function VauvryPage() {
  return (
    <RegionLayout
      title="Vauvry"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="vauvry-guide.md"
    />
  );
}
