import RegionLayout from '@/components/RegionLayout';

export default async function RillyLaMontagnePage() {
  return (
    <RegionLayout
      title="Rilly la Montagne"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="rilly-la-montagne-guide.md"
    />
  );
}
