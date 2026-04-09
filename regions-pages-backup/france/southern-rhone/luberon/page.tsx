import RegionLayout from '@/components/RegionLayout';

export default async function LuberonPage() {
  return (
    <RegionLayout
      title="Luberon"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="luberon-guide.md"
    />
  );
}
