import RegionLayout from '@/components/RegionLayout';

export default async function BandolPage() {
  return (
    <RegionLayout
      title="Bandol"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="bandol-guide.md"
    />
  );
}
