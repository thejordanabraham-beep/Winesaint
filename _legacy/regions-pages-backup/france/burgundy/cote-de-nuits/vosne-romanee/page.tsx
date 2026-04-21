import RegionLayout from '@/components/RegionLayout';

const VOSNEROMANE_VINEYARDS = [
  { name: 'Échezeaux', slug: 'echezeaux', classification: 'grand-cru' as const },
  { name: 'Grands Échezeaux', slug: 'grands-echezeaux', classification: 'grand-cru' as const },
  { name: 'La Grande Rue', slug: 'la-grande-rue', classification: 'grand-cru' as const },
  { name: 'La Romanée', slug: 'la-romanee', classification: 'grand-cru' as const },
  { name: 'La Tâche', slug: 'la-tache', classification: 'grand-cru' as const },
  { name: 'Richebourg', slug: 'richebourg', classification: 'grand-cru' as const },
  { name: 'Romanée-Conti', slug: 'romanee-conti', classification: 'grand-cru' as const },
  { name: 'Romanée-Saint-Vivant', slug: 'romanee-saint-vivant', classification: 'grand-cru' as const },
  { name: 'Au Dessus Des Malconsorts', slug: 'au-dessus-des-malconsorts', classification: 'premier-cru' as const },
  { name: 'Aux Brulees', slug: 'aux-brulees', classification: 'premier-cru' as const },
  { name: 'Aux Malconsorts', slug: 'aux-malconsorts', classification: 'premier-cru' as const },
  { name: 'Aux Reignots', slug: 'aux-reignots', classification: 'premier-cru' as const },
  { name: 'Clos Des Reas', slug: 'clos-des-reas', classification: 'premier-cru' as const },
  { name: 'Cros Parantoux', slug: 'cros-parantoux', classification: 'premier-cru' as const },
  { name: 'En Orveaux', slug: 'en-orveaux', classification: 'premier-cru' as const },
  { name: 'Les Beaux Monts', slug: 'les-beaux-monts', classification: 'premier-cru' as const },
  { name: 'Les Brulees', slug: 'les-brulees', classification: 'premier-cru' as const },
  { name: 'Les Chaumes', slug: 'les-chaumes', classification: 'premier-cru' as const },
  { name: 'Les Gaudichots', slug: 'les-gaudichots', classification: 'premier-cru' as const },
  { name: 'Les Petits Monts', slug: 'les-petits-monts', classification: 'premier-cru' as const },
  { name: 'Les Suchots', slug: 'les-suchots', classification: 'premier-cru' as const },
  { name: 'La Croix Rameau', slug: 'la-croix-rameau', classification: 'premier-cru' as const },
  { name: 'Les Rouges', slug: 'les-rouges', classification: 'premier-cru' as const },
] as const;

export default function VosneRomanePage() {
  return (
    <RegionLayout
      title="Vosne-Romanée"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={VOSNEROMANE_VINEYARDS}
      contentFile="vosne-romanee-guide.md"
    />
  );
}
