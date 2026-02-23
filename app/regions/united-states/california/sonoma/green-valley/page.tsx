import RegionLayout from '@/components/RegionLayout';

export default function GreenValleyPage() {
  return (
    <RegionLayout
      title="Green Valley"
      level="village"
      parentRegion="united-states/california/sonoma"
      contentFile="green-valley-guide.md"
    />
  );
}
