import RegionLayout from '@/components/RegionLayout';

export default function ClarksburgPage() {
  return (
    <RegionLayout
      title="Clarksburg"
      level="sub-region"
      parentRegion="united-states/california/central-valley"
      contentFile="clarksburg-guide.md"
    />
  );
}
