import RegionLayout from '@/components/RegionLayout';

export default async function CassisPage() {
  return (
    <RegionLayout
      title="Cassis"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="cassis-guide.md"
    />
  );
}
