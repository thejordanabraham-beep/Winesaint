import RegionLayout from '@/components/RegionLayout';

export default function NelsonPage() {
  return (
    <RegionLayout
      title="Nelson"
      level="region"
      parentRegion="new-zealand"
      contentFile="nelson-guide.md"
    />
  );
}
