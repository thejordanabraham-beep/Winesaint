import RegionLayout from '@/components/RegionLayout';

export default function OakvillePage() {
  return (
    <RegionLayout
      title="Oakville"
      level="village"
      parentRegion="united-states/california/napa-valley"
      contentFile="oakville-guide.md"
    />
  );
}
