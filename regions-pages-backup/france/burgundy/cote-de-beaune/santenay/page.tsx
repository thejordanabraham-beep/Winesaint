import RegionLayout from '@/components/RegionLayout';

const SANTENAY_VINEYARDS = [
  { name: 'Beauregard', slug: 'beauregard', classification: 'premier-cru' as const },
  { name: 'Beaurepaire', slug: 'beaurepaire', classification: 'premier-cru' as const },
  { name: 'Clos-de-Tavannes', slug: 'clos-de-tavannes', classification: 'premier-cru' as const },
  { name: 'Clos-des-Mouches', slug: 'clos-des-mouches', classification: 'premier-cru' as const },
  { name: 'Clos-Faubard', slug: 'clos-faubard', classification: 'premier-cru' as const },
  { name: 'Clos-Rousseau', slug: 'clos-rousseau', classification: 'premier-cru' as const },
  { name: 'Grand-Clos-Rousseau', slug: 'grand-clos-rousseau', classification: 'premier-cru' as const },
  { name: 'la-Comme', slug: 'la-comme', classification: 'premier-cru' as const },
  { name: 'la-Maladiere', slug: 'la-maladiere', classification: 'premier-cru' as const },
  { name: 'les-Gravieres', slug: 'les-gravieres', classification: 'premier-cru' as const },
  { name: 'Passetemps', slug: 'passetemps', classification: 'premier-cru' as const },
  { name: 'Petit-Clos-Rousseau', slug: 'petit-clos-rousseau', classification: 'premier-cru' as const },
] as const;

export default function SantenayPage() {
  return (
    <RegionLayout
      title="Santenay"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={SANTENAY_VINEYARDS}
      contentFile="santenay-guide.md"
    />
  );
}
