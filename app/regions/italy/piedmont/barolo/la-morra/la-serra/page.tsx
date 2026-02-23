import RegionLayout from '@/components/RegionLayout';

export default function LaSerraPage() {
  return (
    <RegionLayout
      title="La Serra"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="la-serra-guide.md"
    />
  );
}
