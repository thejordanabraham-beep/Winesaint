import RegionLayout from '@/components/RegionLayout';

export default function SloughhousePage() {
  return (
    <RegionLayout
      title="Sloughhouse"
      level="sub-region"
      parentRegion="united-states/california/central-valley"
      contentFile="sloughhouse-guide.md"
    />
  );
}
