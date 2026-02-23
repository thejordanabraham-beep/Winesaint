import RegionLayout from '@/components/RegionLayout';

// Sub-regions of Yarra Valley - proper geographic hierarchy
const YARRAVALLEY_SUBREGIONS = [
  { name: 'Central Yarra', slug: 'central-yarra', type: 'sub-region' },
  { name: 'Lower Yarra', slug: 'lower-yarra', type: 'sub-region' },
  { name: 'Upper Yarra', slug: 'upper-yarra', type: 'sub-region' }
];

export default function YarraValleyPage() {
  return (
    <RegionLayout
      title="Yarra Valley"
      level="region"
      parentRegion="australia"
      sidebarLinks={YARRAVALLEY_SUBREGIONS}
      contentFile="yarra-valley-guide.md"
    />
  );
}
