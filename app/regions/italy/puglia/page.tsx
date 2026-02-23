import RegionLayout from '@/components/RegionLayout';

const PUGLIA_SUB_REGIONS = [
  { name: 'Primitivo di Manduria', slug: 'primitivo-di-manduria' },
  { name: 'Salice Salentino', slug: 'salice-salentino' },
  { name: 'Castel del Monte', slug: 'castel-del-monte' },
  { name: 'Gioia del Colle', slug: 'gioia-del-colle' },
  { name: 'Locorotondo', slug: 'locorotondo' },
  { name: 'Copertino', slug: 'copertino' },
];

export default function PugliaPage() {
  return (
    <RegionLayout
      title="Puglia"
      level="region"
      parentRegion="italy"
      sidebarLinks={PUGLIA_SUB_REGIONS}
      contentFile="puglia-guide.md"
    />
  );
}
