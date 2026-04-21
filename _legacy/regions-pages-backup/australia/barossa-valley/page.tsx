import RegionLayout from '@/components/RegionLayout';

// Major sub-regions and towns of Barossa Valley - proper geographic hierarchy
const BAROSSAVALLEY_SUBREGIONS = [
  { name: 'Eden Valley', slug: 'eden-valley', type: 'sub-region' },
  { name: 'Greenock', slug: 'greenock', type: 'town' },
  { name: 'Lyndoch', slug: 'lyndoch', type: 'town' },
  { name: 'Marananga', slug: 'marananga', type: 'town' },
  { name: 'Nuriootpa', slug: 'nuriootpa', type: 'town' },
  { name: 'Rowland Flat', slug: 'rowland-flat', type: 'town' },
  { name: 'Tanunda', slug: 'tanunda', type: 'town' }
];

export default function BarossaValleyPage() {
  return (
    <RegionLayout
      title="Barossa Valley"
      level="region"
      parentRegion="australia"
      sidebarLinks={BAROSSAVALLEY_SUBREGIONS}
      contentFile="barossa-valley-guide.md"
    />
  );
}
