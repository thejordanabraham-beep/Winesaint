import RegionLayout from '@/components/RegionLayout';

export default function CarpegnaPage() {
  return (
    <RegionLayout
      title="Carpegna"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="carpegna-guide.md"
    />
  );
}
