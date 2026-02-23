import RegionLayout from '@/components/RegionLayout';

export default function LaLevrirePage() {
  return (
    <RegionLayout
      title="La Levrière"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="la-levriere-guide.md"
    />
  );
}
