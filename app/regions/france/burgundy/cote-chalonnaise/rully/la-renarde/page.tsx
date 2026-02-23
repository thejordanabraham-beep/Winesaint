import RegionLayout from '@/components/RegionLayout';

export default function LaRenardePage() {
  return (
    <RegionLayout
      title="La Renarde"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="la-renarde-guide.md"
    />
  );
}
