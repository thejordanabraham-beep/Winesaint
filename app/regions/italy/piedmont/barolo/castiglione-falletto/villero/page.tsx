import RegionLayout from '@/components/RegionLayout';

export default function VilleroPage() {
  return (
    <RegionLayout
      title="Villero"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/castiglione-falletto"
      classification="mga"
      contentFile="villero-guide.md"
    />
  );
}
