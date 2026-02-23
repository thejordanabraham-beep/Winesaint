import RegionLayout from '@/components/RegionLayout';

export default function YountvillePage() {
  return (
    <RegionLayout
      title="Yountville"
      level="village"
      parentRegion="united-states/california/napa-valley"
      contentFile="yountville-guide.md"
    />
  );
}
