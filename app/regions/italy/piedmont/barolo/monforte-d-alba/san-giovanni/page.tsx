import RegionLayout from '@/components/RegionLayout';

export default function SanGiovanniPage() {
  return (
    <RegionLayout
      title="San Giovanni"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/monforte-d-alba"
      classification="mga"
      contentFile="san-giovanni-guide.md"
    />
  );
}
