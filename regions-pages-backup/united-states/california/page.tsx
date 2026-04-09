import RegionLayout from '@/components/RegionLayout';

const CALIFORNIA_REGIONS = [
  { name: 'Napa Valley', slug: 'napa-valley' },
  { name: 'Sonoma', slug: 'sonoma' },
  { name: 'Mendocino', slug: 'mendocino' },
  { name: 'Central Coast', slug: 'central-coast' },
  { name: 'Paso Robles', slug: 'paso-robles' },
  { name: 'Santa Barbara', slug: 'santa-barbara' },
  { name: 'Central Valley', slug: 'central-valley' },
  { name: 'Sierra Foothills', slug: 'sierra-foothills' },
];

export default function CaliforniaPage() {
  return (
    <RegionLayout
      title="California"
      level="region"
      parentRegion="united-states"
      sidebarLinks={CALIFORNIA_REGIONS}
      sidebarTitle="Regions"
      contentFile="california-guide.md"
    />
  );
}
