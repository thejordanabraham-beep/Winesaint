import RegionLayout from '@/components/RegionLayout';

export default function CalistogaPage() {
  return (
    <RegionLayout
      title="Calistoga"
      level="village"
      parentRegion="united-states/california/napa-valley"
      contentFile="calistoga-guide.md"
    />
  );
}
