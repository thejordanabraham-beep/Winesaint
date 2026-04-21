import RegionLayout from '@/components/RegionLayout';

export default function CoveloPage() {
  return (
    <RegionLayout
      title="Covelo"
      level="village"
      parentRegion="united-states/california/mendocino"
      contentFile="covelo-guide.md"
    />
  );
}
