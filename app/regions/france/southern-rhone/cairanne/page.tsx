import RegionLayout from '@/components/RegionLayout';

export default async function CairannePage() {
  return (
    <RegionLayout
      title="Cairanne"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="cairanne-guide.md"
    />
  );
}
