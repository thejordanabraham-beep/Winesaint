import RegionLayout from '@/components/RegionLayout';

const WASHINGTON_REGIONS = [
  { name: 'Columbia Valley', slug: 'columbia-valley' },
  { name: 'Puget Sound', slug: 'puget-sound' },
  { name: 'Columbia Gorge', slug: 'columbia-gorge' },
];

export default function WashingtonPage() {
  return (
    <RegionLayout
      title="Washington"
      level="region"
      parentRegion="united-states"
      sidebarLinks={WASHINGTON_REGIONS}
      sidebarTitle="Regions"
      contentFile="washington-guide.md"
    />
  );
}
