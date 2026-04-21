import RegionLayout from '@/components/RegionLayout';

export default function SonomaValleyPage() {
  return (
    <RegionLayout
      title="Sonoma Valley"
      level="village"
      parentRegion="united-states/california/sonoma"
      contentFile="sonoma-valley-guide.md"
    />
  );
}
