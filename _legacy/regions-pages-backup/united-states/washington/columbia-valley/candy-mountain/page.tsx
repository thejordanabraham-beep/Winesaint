import RegionLayout from '@/components/RegionLayout';

export default function CandyMountainPage() {
  return (
    <RegionLayout
      title="Candy Mountain"
      level="sub-region"
      parentRegion="united-states/washington/columbia-valley"
      contentFile="candy-mountain-guide.md"
    />
  );
}
