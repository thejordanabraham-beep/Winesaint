import RegionLayout from '@/components/RegionLayout';

const POMMARD_VINEYARDS = [
  { name: 'Clos-Blanc', slug: 'clos-blanc', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Commaraine', slug: 'clos-de-la-commaraine', classification: 'premier-cru' as const },
  { name: 'Clos-de-Verger', slug: 'clos-de-verger', classification: 'premier-cru' as const },
  { name: 'Clos-des-Epeneaux', slug: 'clos-des-epeneaux', classification: 'premier-cru' as const },
  { name: 'Derriere-Saint-Jean', slug: 'derriere-saint-jean', classification: 'premier-cru' as const },
  { name: 'En-Largilliere', slug: 'en-largilliere', classification: 'premier-cru' as const },
  { name: 'la-Chaniere', slug: 'la-chaniere', classification: 'premier-cru' as const },
  { name: 'la-Platiere', slug: 'la-platiere', classification: 'premier-cru' as const },
  { name: 'la-Refene', slug: 'la-refene', classification: 'premier-cru' as const },
  { name: 'le-Clos-Micot', slug: 'le-clos-micot', classification: 'premier-cru' as const },
  { name: 'le-Village', slug: 'le-village', classification: 'premier-cru' as const },
  { name: 'les-Arvelets', slug: 'les-arvelets', classification: 'premier-cru' as const },
  { name: 'les-Bertins', slug: 'les-bertins', classification: 'premier-cru' as const },
  { name: 'les-Boucherottes', slug: 'les-boucherottes', classification: 'premier-cru' as const },
  { name: 'les-Chanlins-Bas', slug: 'les-chanlins-bas', classification: 'premier-cru' as const },
  { name: 'les-Chaponnieres', slug: 'les-chaponnieres', classification: 'premier-cru' as const },
  { name: 'les-Charmots', slug: 'les-charmots', classification: 'premier-cru' as const },
  { name: 'les-Combes-Dessus', slug: 'les-combes-dessus', classification: 'premier-cru' as const },
  { name: 'les-Croix-Noires', slug: 'les-croix-noires', classification: 'premier-cru' as const },
  { name: 'les-Epenots', slug: 'les-epenots', classification: 'premier-cru' as const },
  { name: 'les-Fremiers', slug: 'les-fremiers', classification: 'premier-cru' as const },
  { name: 'les-Grands-Epenots', slug: 'les-grands-epenots', classification: 'premier-cru' as const },
  { name: 'les-Jarolieres', slug: 'les-jarolieres', classification: 'premier-cru' as const },
  { name: 'les-Petits-Epenots', slug: 'les-petits-epenots', classification: 'premier-cru' as const },
  { name: 'les-Pezerolles', slug: 'les-pezerolles', classification: 'premier-cru' as const },
  { name: 'les-Poutures', slug: 'les-poutures', classification: 'premier-cru' as const },
  { name: 'les-Rugiens', slug: 'les-rugiens', classification: 'premier-cru' as const },
  { name: 'les-Rugiens-Bas', slug: 'les-rugiens-bas', classification: 'premier-cru' as const },
  { name: 'les-Rugiens-Hauts', slug: 'les-rugiens-hauts', classification: 'premier-cru' as const },
  { name: 'les-Saussilles', slug: 'les-saussilles', classification: 'premier-cru' as const },
] as const;

export default function PommardPage() {
  return (
    <RegionLayout
      title="Pommard"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={POMMARD_VINEYARDS}
      contentFile="pommard-guide.md"
    />
  );
}
