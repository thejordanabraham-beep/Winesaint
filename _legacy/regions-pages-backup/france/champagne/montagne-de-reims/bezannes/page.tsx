import RegionLayout from '@/components/RegionLayout';

export default async function BezannesPage() {
  return (
    <RegionLayout
      title="Bezannes"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="bezannes-guide.md"
    />
  );
}
