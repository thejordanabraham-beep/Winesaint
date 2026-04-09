import RegionLayout from '@/components/RegionLayout';

export default async function LiracPage() {
  return (
    <RegionLayout
      title="Lirac"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="lirac-guide.md"
    />
  );
}
