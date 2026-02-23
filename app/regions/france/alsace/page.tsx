import RegionLayout from '@/components/RegionLayout';

// Alsace departments (sub-regions)
const ALSACE_SUB_REGIONS = [
  { name: 'Haut-Rhin', slug: 'haut-rhin' },
  { name: 'Bas-Rhin', slug: 'bas-rhin' },
];

export default function AlsacePage() {
  return (
    <RegionLayout
      title="Alsace"
      level="region"
      parentRegion="france"
      sidebarLinks={ALSACE_SUB_REGIONS}
      sidebarTitle="Sub-Regions"
      contentFile="alsace-guide.md"
    />
  );
}
