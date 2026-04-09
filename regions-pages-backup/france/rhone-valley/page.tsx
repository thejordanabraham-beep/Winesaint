import RegionLayout from '@/components/RegionLayout';

const RHONE_VALLEY_SUB_REGIONS = [
  { name: 'Northern Rhône', slug: 'northern-rhone' },
  { name: 'Southern Rhône', slug: 'southern-rhone' },
];

export default function RhoneValleyPage() {
  return (
    <RegionLayout
      title="Rhône Valley"
      level="region"
      parentRegion="france"
      sidebarLinks={RHONE_VALLEY_SUB_REGIONS}
      sidebarTitle="Sub-Regions"
      contentFile="rhone-valley-guide.md"
    />
  );
}
