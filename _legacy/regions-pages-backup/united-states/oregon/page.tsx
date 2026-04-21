import RegionLayout from '@/components/RegionLayout';

const OREGON_REGIONS = [
  { name: 'Willamette Valley', slug: 'willamette-valley' },
  { name: 'Southern Oregon', slug: 'southern-oregon' },
  { name: 'Columbia Gorge', slug: 'columbia-gorge' },
  { name: 'Columbia Valley', slug: 'columbia-valley' },
  { name: 'Walla Walla Valley', slug: 'walla-walla-valley' },
  { name: 'Snake River Valley', slug: 'snake-river-valley' },
];

export default function OregonPage() {
  return (
    <RegionLayout
      title="Oregon"
      level="region"
      parentRegion="united-states"
      sidebarLinks={OREGON_REGIONS}
      sidebarTitle="Regions"
      contentFile="oregon-guide.md"
    />
  );
}
