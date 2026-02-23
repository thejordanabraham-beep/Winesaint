import RegionLayout from '@/components/RegionLayout';

export default function LaFossePage() {
  return (
    <RegionLayout
      title="La Fosse"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="la-fosse-guide.md"
    />
  );
}
