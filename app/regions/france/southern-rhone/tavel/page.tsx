import RegionLayout from '@/components/RegionLayout';

export default async function TavelPage() {
  return (
    <RegionLayout
      title="Tavel"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="tavel-guide.md"
    />
  );
}
