import RegionLayout from '@/components/RegionLayout';

export default function ChilesValleyPage() {
  return (
    <RegionLayout
      title="Chiles Valley"
      level="village"
      parentRegion="united-states/california/napa-valley"
      contentFile="chiles-valley-guide.md"
    />
  );
}
