import RegionLayout from '@/components/RegionLayout';

export default async function CoulommesLaMontagnePage() {
  return (
    <RegionLayout
      title="Coulommes la Montagne"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="coulommes-la-montagne-guide.md"
    />
  );
}
