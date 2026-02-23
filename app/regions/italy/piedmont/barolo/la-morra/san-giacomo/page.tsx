import RegionLayout from '@/components/RegionLayout';

export default function SanGiacomoPage() {
  return (
    <RegionLayout
      title="San Giacomo"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="san-giacomo-guide.md"
    />
  );
}
