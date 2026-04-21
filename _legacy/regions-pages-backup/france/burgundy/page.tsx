import RegionLayout from '@/components/RegionLayout';

const BURGUNDY_SUB_REGIONS = [
  { name: 'Chablis', slug: 'chablis' },
  { name: 'Côte de Nuits', slug: 'cote-de-nuits' },
  { name: 'Côte de Beaune', slug: 'cote-de-beaune' },
  { name: 'Côte Chalonnaise', slug: 'cote-chalonnaise' },
  { name: 'Mâconnais', slug: 'maconnais' },
];

export default function BurgundyPage() {
  return (
    <RegionLayout
      title="Burgundy"
      level="region"
      parentRegion="france"
      sidebarLinks={BURGUNDY_SUB_REGIONS}
      contentFile="burgundy-guide.md"
    />
  );
}
