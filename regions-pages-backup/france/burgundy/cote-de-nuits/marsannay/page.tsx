import RegionLayout from '@/components/RegionLayout';

const MARSANNAY_VINEYARDS = [
  { name: 'Au-Champ-Salomon', slug: 'au-champ-salomon', classification: 'premier-cru' as const },
  { name: 'Champs-Perdrix', slug: 'champs-perdrix', classification: 'premier-cru' as const },
  { name: 'En-Grands-Vaux', slug: 'en-grands-vaux', classification: 'premier-cru' as const },
  { name: 'En-la-Montagne', slug: 'en-la-montagne', classification: 'premier-cru' as const },
  { name: 'la-Charme-Aux-Pretres', slug: 'la-charme-aux-pretres', classification: 'premier-cru' as const },
  { name: 'le-Clos', slug: 'le-clos', classification: 'premier-cru' as const },
  { name: 'le-Clos-de-Jeu', slug: 'le-clos-de-jeu', classification: 'premier-cru' as const },
  { name: 'le-Clos-du-Roy', slug: 'le-clos-du-roy', classification: 'premier-cru' as const },
  { name: 'les-Boivin', slug: 'les-boivin', classification: 'premier-cru' as const },
  { name: 'les-Favieres', slug: 'les-favieres', classification: 'premier-cru' as const },
  { name: 'les-Grasses-Tetes', slug: 'les-grasses-tetes', classification: 'premier-cru' as const },
  { name: 'Longeroies', slug: 'longeroies', classification: 'premier-cru' as const },
] as const;

export default function MarsannayPage() {
  return (
    <RegionLayout
      title="Marsannay"
      level="village"
      parentRegion="france/burgundy/cote-de-nuits"
      sidebarLinks={MARSANNAY_VINEYARDS}
      contentFile="marsannay-guide.md"
    />
  );
}
