import RegionLayout from '@/components/RegionLayout';

export default async function LouvoisPage() {
  return (
    <RegionLayout
      title="Louvois"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="louvois-guide.md"
    />
  );
}
