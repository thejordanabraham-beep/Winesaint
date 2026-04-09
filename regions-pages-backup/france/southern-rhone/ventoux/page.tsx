import RegionLayout from '@/components/RegionLayout';

export default async function VentouxPage() {
  return (
    <RegionLayout
      title="Ventoux"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="ventoux-guide.md"
    />
  );
}
