import RegionLayout from '@/components/RegionLayout';

export default function CiocchiniPage() {
  return (
    <RegionLayout
      title="Ciocchini"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/castiglione-falletto"
      classification="mga"
      contentFile="ciocchini-guide.md"
    />
  );
}
