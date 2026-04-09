import RegionLayout from '@/components/RegionLayout';

const FIXIN_VINEYARDS = [
  { name: 'Clos-de-la-Perriere', slug: 'clos-de-la-perriere', classification: 'premier-cru' as const },
  { name: 'Clos-du-Chapitre', slug: 'clos-du-chapitre', classification: 'premier-cru' as const },
  { name: 'Clos-Napoleon', slug: 'clos-napoleon', classification: 'premier-cru' as const },
  { name: 'En-Suchot', slug: 'en-suchot', classification: 'premier-cru' as const },
  { name: 'les-Arvelets', slug: 'les-arvelets', classification: 'premier-cru' as const },
  { name: 'les-Hervelets', slug: 'les-hervelets', classification: 'premier-cru' as const },
  { name: 'Queue-de-Hareng', slug: 'queue-de-hareng', classification: 'premier-cru' as const },
] as const;

export default function FixinPage() {
  return (
    <RegionLayout
      title="Fixin"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={FIXIN_VINEYARDS}
      contentFile="fixin-guide.md"
    />
  );
}
