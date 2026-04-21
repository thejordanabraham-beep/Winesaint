import RegionLayout from '@/components/RegionLayout';

// Sierra Foothills AVAs
const SIERRA_FOOTHILLS_AVAS = [
  { name: 'California Shenandoah Valley', slug: 'california-shenandoah-valley' },
  { name: 'El Dorado', slug: 'el-dorado' },
  { name: 'Fair Play', slug: 'fair-play' },
  { name: 'Fiddletown', slug: 'fiddletown' },
  { name: 'North Yuba', slug: 'north-yuba' },
  { name: 'Pleasant Valley', slug: 'pleasant-valley' },
  { name: 'Sierra Pelona Valley', slug: 'sierra-pelona-valley' },
];

export default function SierraFoothillsPage() {
  return (
    <RegionLayout
      title="Sierra Foothills"
      level="sub-region"
      parentRegion="united-states/california"
      sidebarLinks={SIERRA_FOOTHILLS_AVAS}
      contentFile="sierra-foothills-guide.md"
    />
  );
}
