import RegionLayout from '@/components/RegionLayout';

export default function LodiPage() {
  return (
    <RegionLayout
      title="Lodi"
      level="sub-region"
      parentRegion="united-states/california/central-valley"
      contentFile="lodi-guide.md"
    />
  );
}
