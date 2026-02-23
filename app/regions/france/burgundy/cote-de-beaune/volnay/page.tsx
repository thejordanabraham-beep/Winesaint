import RegionLayout from '@/components/RegionLayout';

const VOLNAY_VINEYARDS = [
  { name: 'Carelle-Sous-la-Chapelle', slug: 'carelle-sous-la-chapelle', classification: 'premier-cru' as const },
  { name: 'Champans', slug: 'champans', classification: 'premier-cru' as const },
  { name: 'Clos-de-L-Audignac', slug: 'clos-de-l-audignac', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Barre', slug: 'clos-de-la-barre', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Bousse-D-Or', slug: 'clos-de-la-bousse-d-or', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Cave-des-Ducs', slug: 'clos-de-la-cave-des-ducs', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Chapelle', slug: 'clos-de-la-chapelle', classification: 'premier-cru' as const },
  { name: 'Clos-de-la-Rougeotte', slug: 'clos-de-la-rougeotte', classification: 'premier-cru' as const },
  { name: 'Clos-des-60-Ouvrees', slug: 'clos-des-60-ouvrees', classification: 'premier-cru' as const },
  { name: 'Clos-des-Chenes', slug: 'clos-des-chenes', classification: 'premier-cru' as const },
  { name: 'Clos-des-Ducs', slug: 'clos-des-ducs', classification: 'premier-cru' as const },
  { name: 'En-L-Ormeau', slug: 'en-l-ormeau', classification: 'premier-cru' as const },
  { name: 'Fremiets', slug: 'fremiets', classification: 'premier-cru' as const },
  { name: 'Fremiets-Clos-de-la-Rougeotte', slug: 'fremiets-clos-de-la-rougeotte', classification: 'premier-cru' as const },
  { name: 'Lassolle', slug: 'lassolle', classification: 'premier-cru' as const },
  { name: 'les-Aussy', slug: 'les-aussy', classification: 'premier-cru' as const },
  { name: 'les-Brouillards', slug: 'les-brouillards', classification: 'premier-cru' as const },
  { name: 'les-Caillerets', slug: 'les-caillerets', classification: 'premier-cru' as const },
  { name: 'les-Lurets', slug: 'les-lurets', classification: 'premier-cru' as const },
  { name: 'les-Mitans', slug: 'les-mitans', classification: 'premier-cru' as const },
  { name: 'les-Santenots', slug: 'les-santenots', classification: 'premier-cru' as const },
  { name: 'Pointe-D-Angles', slug: 'pointe-d-angles', classification: 'premier-cru' as const },
  { name: 'Robardelle', slug: 'robardelle', classification: 'premier-cru' as const },
  { name: 'Ronceret', slug: 'ronceret', classification: 'premier-cru' as const },
  { name: 'Taille-Pieds', slug: 'taille-pieds', classification: 'premier-cru' as const },
  { name: 'Caillerets', slug: 'caillerets', classification: 'premier-cru' as const },] as const;

export default function VolnayPage() {
  return (
    <RegionLayout
      title="Volnay"
      level="village"
      parentRegion="france/burgundy/cote-de-beaune"
      sidebarLinks={VOLNAY_VINEYARDS}
      contentFile="volnay-guide.md"
    />
  );
}
