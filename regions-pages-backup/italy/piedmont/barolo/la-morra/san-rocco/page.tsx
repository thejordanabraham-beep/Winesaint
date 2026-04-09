import RegionLayout from '@/components/RegionLayout';

export default function SanRoccoPage() {
  return (
    <RegionLayout
      title="San Rocco"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="san-rocco-guide.md"
    />
  );
}
