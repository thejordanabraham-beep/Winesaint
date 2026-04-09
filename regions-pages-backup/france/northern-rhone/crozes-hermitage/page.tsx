import RegionLayout from '@/components/RegionLayout';

export default async function CrozesHermitagePage() {
  return (
    <RegionLayout
      title="Crozes-Hermitage"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="crozes-hermitage-guide.md"
    />
  );
}
