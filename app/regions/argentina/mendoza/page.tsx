import RegionLayout from '@/components/RegionLayout';

// Major departments and sub-regions of Mendoza - proper geographic hierarchy
const MENDOZA_SUBREGIONS = [
  { name: 'Luján de Cuyo', slug: 'lujan-de-cuyo', type: 'department' },
  { name: 'Maipú', slug: 'maipu', type: 'department' },
  { name: 'San Martín', slug: 'san-martin', type: 'department' },
  { name: 'San Rafael', slug: 'san-rafael', type: 'department' },
  { name: 'Uco Valley', slug: 'uco-valley', type: 'sub-region' }
];

export default function MendozaPage() {
  return (
    <RegionLayout
      title="Mendoza"
      level="region"
      parentRegion="argentina"
      sidebarLinks={MENDOZA_SUBREGIONS}
      contentFile="mendoza-guide.md"
    />
  );
}
