import RegionLayout from '@/components/RegionLayout';

export default function MariondinoPage() {
  return (
    <RegionLayout
      title="Mariondino"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/castiglione-falletto"
      classification="mga"
      contentFile="mariondino-guide.md"
    />
  );
}
