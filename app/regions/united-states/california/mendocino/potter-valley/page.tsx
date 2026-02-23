import RegionLayout from '@/components/RegionLayout';

export default function PotterValleyPage() {
  return (
    <RegionLayout
      title="Potter Valley"
      level="village"
      parentRegion="united-states/california/mendocino"
      contentFile="potter-valley-guide.md"
    />
  );
}
