import RegionLayout from '@/components/RegionLayout';

const GIVRY_VINEYARDS = [
  { name: 'A-Vigne-Rouge', slug: 'a-vigne-rouge', classification: 'premier-cru' as const },
  { name: 'Champ-Nalot', slug: 'champ-nalot', classification: 'premier-cru' as const },
  { name: 'Clos-Charle', slug: 'clos-charle', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Baraude', slug: 'clos-de-la-baraude', classification: 'premier-cru' as const },
  { name: 'Clos-du-Cellier-Aux-Moines', slug: 'clos-du-cellier-aux-moines', classification: 'premier-cru' as const },
  { name: 'Clos-du-Cras-Long', slug: 'clos-du-cras-long', classification: 'premier-cru' as const },
  { name: 'Clos-du-Vernoy', slug: 'clos-du-vernoy', classification: 'premier-cru' as const },
  { name: 'Clos-Jus', slug: 'clos-jus', classification: 'premier-cru' as const },
  { name: 'Clos-Marceaux', slug: 'clos-marceaux', classification: 'premier-cru' as const },
  { name: 'Clos-Marole', slug: 'clos-marole', classification: 'premier-cru' as const },
  { name: 'Clos-Saint-Paul', slug: 'clos-saint-paul', classification: 'premier-cru' as const },
  { name: 'Clos-Saint-Pierre', slug: 'clos-saint-pierre', classification: 'premier-cru' as const },
  { name: 'Clos-Salomon', slug: 'clos-salomon', classification: 'premier-cru' as const },
  { name: 'Crauzot', slug: 'crauzot', classification: 'premier-cru' as const },
  { name: 'Cremillons', slug: 'cremillons', classification: 'premier-cru' as const },
  { name: 'En-Choue', slug: 'en-choue', classification: 'premier-cru' as const },
  { name: 'En-Veau', slug: 'en-veau', classification: 'premier-cru' as const },
  { name: 'la-Brulee', slug: 'la-brulee', classification: 'premier-cru' as const },
  { name: 'la-Grande-Berge', slug: 'la-grande-berge', classification: 'premier-cru' as const },
  { name: 'la-Matrosse', slug: 'la-matrosse', classification: 'premier-cru' as const },
  { name: 'la-Petite-Berge', slug: 'la-petite-berge', classification: 'premier-cru' as const },
  { name: 'la-Plante', slug: 'la-plante', classification: 'premier-cru' as const },
  { name: 'le-Champ-Lalot', slug: 'le-champ-lalot', classification: 'premier-cru' as const },
  { name: 'le-Medenchot', slug: 'le-medenchot', classification: 'premier-cru' as const },
  { name: 'le-Paradis', slug: 'le-paradis', classification: 'premier-cru' as const },
  { name: 'le-Petit-Pretan', slug: 'le-petit-pretan', classification: 'premier-cru' as const },
  { name: 'le-Pied-du-Clou', slug: 'le-pied-du-clou', classification: 'premier-cru' as const },
  { name: 'le-Vernoy', slug: 'le-vernoy', classification: 'premier-cru' as const },
  { name: 'le-Vigron', slug: 'le-vigron', classification: 'premier-cru' as const },
  { name: 'les-Bois-Chevaux', slug: 'les-bois-chevaux', classification: 'premier-cru' as const },
  { name: 'les-Bois-Gautiers', slug: 'les-bois-gautiers', classification: 'premier-cru' as const },
  { name: 'les-Combes', slug: 'les-combes', classification: 'premier-cru' as const },
  { name: 'les-Galaffres', slug: 'les-galaffres', classification: 'premier-cru' as const },
  { name: 'les-Grandes-Vignes', slug: 'les-grandes-vignes', classification: 'premier-cru' as const },
  { name: 'les-Grands-Pretans', slug: 'les-grands-pretans', classification: 'premier-cru' as const },
  { name: 'Petit-Marole', slug: 'petit-marole', classification: 'premier-cru' as const },
  { name: 'Pied-de-Chaume', slug: 'pied-de-chaume', classification: 'premier-cru' as const },
  { name: 'Servoisine', slug: 'servoisine', classification: 'premier-cru' as const },
] as const;

export default function GivryPage() {
  return (
    <RegionLayout
      title="Givry"
      level="village"
      parentRegion="france/burgundy/cote-chalonnaise"
      sidebarLinks={GIVRY_VINEYARDS}
      contentFile="givry-guide.md"
    />
  );
}
