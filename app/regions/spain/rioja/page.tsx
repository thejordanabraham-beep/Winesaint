import RegionLayout from '@/components/RegionLayout';

// Official sub-regions of Rioja - proper geographic hierarchy
const RIOJA_SUBREGIONS = [
  { name: 'Rioja Alta', slug: 'rioja-alta', type: 'sub-region' },
  { name: 'Rioja Alavesa', slug: 'rioja-alavesa', type: 'sub-region' },
  { name: 'Rioja Oriental', slug: 'rioja-oriental', type: 'sub-region' }
];

export default function RiojaPage() {
  return (
    <RegionLayout
      title="Rioja"
      level="region"
      parentRegion="spain"
      sidebarLinks={RIOJA_SUBREGIONS}
      contentFile="rioja-guide.md"
    />
  );
}
