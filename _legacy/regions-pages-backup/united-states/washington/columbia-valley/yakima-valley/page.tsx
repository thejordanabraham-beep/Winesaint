import RegionLayout from '@/components/RegionLayout';

export default function YakimaValleyPage() {
  return (
    <RegionLayout
      title="Yakima Valley"
      level="sub-region"
      parentRegion="united-states/washington/columbia-valley"
      contentFile="yakima-valley-guide.md"
    />
  );
}
