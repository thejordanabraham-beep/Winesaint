import RegionLayout from '@/components/RegionLayout';

export default function SerraPage() {
  return (
    <RegionLayout
      title="Serra"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="serra-guide.md"
    />
  );
}
