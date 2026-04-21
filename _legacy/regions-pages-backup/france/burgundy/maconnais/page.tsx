import RegionLayout from '@/components/RegionLayout';

const MACONNAIS_APPELLATIONS = [
  { name: 'Pouilly-Fuissé', slug: 'pouilly-fuisse' },
  { name: 'Pouilly-Vinzelles', slug: 'pouilly-vinzelles' },
  { name: 'Pouilly-Loché', slug: 'pouilly-loche' },
  { name: 'Saint-Véran', slug: 'saint-veran' },
  { name: 'Viré-Clessé', slug: 'vire-clesse' },
];

export default function MaconnaisPage() {
  return (
    <RegionLayout
      title="Mâconnais"
      level="sub-region"
      parentRegion="france/burgundy"
      sidebarLinks={MACONNAIS_APPELLATIONS}
      contentFile="maconnais-guide.md"
    />
  );
}
