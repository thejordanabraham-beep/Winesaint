import RegionLayout from '@/components/RegionLayout';

const SICILY_SUB_REGIONS = [
  { name: 'Etna', slug: 'etna' },
  { name: 'Cerasuolo di Vittoria', slug: 'cerasuolo-di-vittoria' },
  { name: 'Marsala', slug: 'marsala' },
  { name: 'Pantelleria', slug: 'pantelleria' },
];

export default function SicilyPage() {
  return (
    <RegionLayout
      title="Sicily"
      level="region"
      parentRegion="italy"
      sidebarLinks={SICILY_SUB_REGIONS}
      contentFile="sicily-guide.md"
    />
  );
}
