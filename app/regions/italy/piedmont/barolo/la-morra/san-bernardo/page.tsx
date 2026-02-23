import RegionLayout from '@/components/RegionLayout';

export default function SanBernardoPage() {
  return (
    <RegionLayout
      title="San Bernardo"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/la-morra"
      classification="mga"
      contentFile="san-bernardo-guide.md"
    />
  );
}
