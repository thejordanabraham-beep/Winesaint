import RegionLayout from '@/components/RegionLayout';

export default function MarissouPage() {
  return (
    <RegionLayout
      title="Marissou"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="marissou-guide.md"
    />
  );
}
