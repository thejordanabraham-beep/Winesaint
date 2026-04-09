import RegionLayout from '@/components/RegionLayout';

export default async function BelletPage() {
  return (
    <RegionLayout
      title="Bellet"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="bellet-guide.md"
    />
  );
}
