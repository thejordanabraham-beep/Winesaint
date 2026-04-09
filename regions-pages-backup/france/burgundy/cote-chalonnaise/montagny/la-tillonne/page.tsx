import RegionLayout from '@/components/RegionLayout';

export default function LaTillonnePage() {
  return (
    <RegionLayout
      title="La Tillonne"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="la-tillonne-guide.md"
    />
  );
}
