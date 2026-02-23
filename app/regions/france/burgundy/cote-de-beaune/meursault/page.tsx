import RegionLayout from '@/components/RegionLayout';

const MEURSAULT_VINEYARDS = [
  { name: 'Blagny', slug: 'blagny', classification: 'premier-cru' as const },
  { name: 'Charmes', slug: 'charmes', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Barre', slug: 'clos-de-la-barre', classification: 'premier-cru' as const },
  { name: 'Clos-des-Perrieres', slug: 'clos-des-perrieres', classification: 'premier-cru' as const },
  { name: 'Genevrieres', slug: 'genevrieres', classification: 'premier-cru' as const },
  { name: 'Goutte-D-Or', slug: 'goutte-d-or', classification: 'premier-cru' as const },
  { name: 'la-Jeunellotte', slug: 'la-jeunellotte', classification: 'premier-cru' as const },
  { name: 'la-Piece-Sous-le-Bois', slug: 'la-piece-sous-le-bois', classification: 'premier-cru' as const },
  { name: 'les-Boucheres', slug: 'les-boucheres', classification: 'premier-cru' as const },
  { name: 'les-Caillerets', slug: 'les-caillerets', classification: 'premier-cru' as const },
  { name: 'les-Charmes-Meursault', slug: 'les-charmes-meursault', classification: 'premier-cru' as const },
  { name: 'les-Cras', slug: 'les-cras', classification: 'premier-cru' as const },
  { name: 'les-Genevrieres', slug: 'les-genevrieres', classification: 'premier-cru' as const },
  { name: 'les-Perrieres-Meursault', slug: 'les-perrieres-meursault', classification: 'premier-cru' as const },
  { name: 'les-Plures', slug: 'les-plures', classification: 'premier-cru' as const },
  { name: 'les-Ravelles', slug: 'les-ravelles', classification: 'premier-cru' as const },
  { name: 'les-Santenots', slug: 'les-santenots', classification: 'premier-cru' as const },
  { name: 'les-Santenots-du-Milieu', slug: 'les-santenots-du-milieu', classification: 'premier-cru' as const },
  { name: 'Perrieres', slug: 'perrieres', classification: 'premier-cru' as const },
  { name: 'Poruzot', slug: 'poruzot', classification: 'premier-cru' as const },
  { name: 'Sous-Blagny', slug: 'sous-blagny', classification: 'premier-cru' as const },
  { name: 'Sous-le-Dos-Dane', slug: 'sous-le-dos-dane', classification: 'premier-cru' as const },
] as const;

export default function MeursaultPage() {
  return (
    <RegionLayout
      title="Meursault"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={MEURSAULT_VINEYARDS}
      contentFile="meursault-guide.md"
    />
  );
}
