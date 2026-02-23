import RegionLayout from '@/components/RegionLayout';

export default async function MontbrePage() {
  return (
    <RegionLayout
      title="Montbre"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="montbré-guide.md"
    />
  );
}
