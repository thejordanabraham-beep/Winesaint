import RegionLayout from '@/components/RegionLayout';

export default function LeClosduRoyPage() {
  return (
    <RegionLayout
      title="Le Clos du Roy"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="le-clos-du-roy-guide.md"
    />
  );
}
