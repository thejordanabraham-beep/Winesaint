import RegionLayout from '@/components/RegionLayout';

export default function McMinnvillePage() {
  return (
    <RegionLayout
      title="McMinnville"
      level="village"
      parentRegion="united-states/oregon/willamette-valley"
      contentFile="mcminnville-guide.md"
    />
  );
}
