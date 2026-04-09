import RegionLayout from '@/components/RegionLayout';

export default async function PierrevertPage() {
  return (
    <RegionLayout
      title="Pierrevert"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="pierrevert-guide.md"
    />
  );
}
