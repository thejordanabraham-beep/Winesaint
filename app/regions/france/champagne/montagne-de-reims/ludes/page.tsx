import RegionLayout from '@/components/RegionLayout';

export default async function LudesPage() {
  return (
    <RegionLayout
      title="Ludes"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="ludes-guide.md"
    />
  );
}
