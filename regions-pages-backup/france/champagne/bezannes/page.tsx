import RegionLayout from '@/components/RegionLayout';

export default function BezannesPage() {
  return (
    <RegionLayout
      title="Bezannes"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="bezannes-guide.md"
    />
  );
}
