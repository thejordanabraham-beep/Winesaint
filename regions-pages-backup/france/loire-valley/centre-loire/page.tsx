import RegionLayout from '@/components/RegionLayout';

// Centre-Loire appellations - consolidated structure
const CENTRE_LOIRE_APPELLATIONS = [
  { name: 'Sancerre', slug: 'sancerre' },
  { name: 'Pouilly-Fumé', slug: 'pouilly-fume' },
  { name: 'Pouilly-sur-Loire', slug: 'pouilly-sur-loire' },
  { name: 'Menetou-Salon', slug: 'menetou-salon' },
  { name: 'Quincy', slug: 'quincy' },
  { name: 'Reuilly', slug: 'reuilly' },
];

export default function CentreLoirePage() {
  return (
    <RegionLayout
      title="Centre-Loire"
      level="sub-region"
      parentRegion="france/loire-valley"
      sidebarLinks={CENTRE_LOIRE_APPELLATIONS}
      contentFile="centre-loire-guide.md"
    />
  );
}
