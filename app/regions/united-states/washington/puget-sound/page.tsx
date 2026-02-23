import RegionLayout from '@/components/RegionLayout';

export default function PugetSoundPage() {
  return (
    <RegionLayout
      title="Puget Sound"
      level="sub-region"
      parentRegion="united-states/washington"
      contentFile="puget-sound-guide.md"
    />
  );
}
