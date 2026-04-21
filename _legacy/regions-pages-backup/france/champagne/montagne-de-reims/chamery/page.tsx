import RegionLayout from '@/components/RegionLayout';

export default async function ChameryPage() {
  return (
    <RegionLayout
      title="Chamery"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="chamery-guide.md"
    />
  );
}
