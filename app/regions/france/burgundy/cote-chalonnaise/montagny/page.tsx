import RegionLayout from '@/components/RegionLayout';

const MONTAGNY_VINEYARDS = [
  { name: 'Cruzille', slug: 'cruzille', classification: 'premier-cru' as const },
  { name: 'Davenay', slug: 'davenay', classification: 'premier-cru' as const },
  { name: 'la-Corvee', slug: 'la-corvee', classification: 'premier-cru' as const },
  { name: 'la-Groule', slug: 'la-groule', classification: 'premier-cru' as const },
  { name: 'la-Pallue', slug: 'la-pallue', classification: 'premier-cru' as const },
  { name: 'la-Tillonne', slug: 'la-tillonne', classification: 'premier-cru' as const },
  { name: 'le-Corbeau', slug: 'le-corbeau', classification: 'premier-cru' as const },
  { name: 'le-Creux-de-la-Feuille', slug: 'le-creux-de-la-feuille', classification: 'premier-cru' as const },
  { name: 'le-Curtil', slug: 'le-curtil', classification: 'premier-cru' as const },
  { name: 'le-May', slug: 'le-may', classification: 'premier-cru' as const },
  { name: 'le-May-Cottin', slug: 'le-may-cottin', classification: 'premier-cru' as const },
  { name: 'le-May-Morin', slug: 'le-may-morin', classification: 'premier-cru' as const },
  { name: 'le-Reculleron', slug: 'le-reculleron', classification: 'premier-cru' as const },
  { name: 'le-Reuilly', slug: 'le-reuilly', classification: 'premier-cru' as const },
  { name: 'les-Beaucons', slug: 'les-beaucons', classification: 'premier-cru' as const },
  { name: 'les-Betaux', slug: 'les-betaux', classification: 'premier-cru' as const },
  { name: 'les-Brus', slug: 'les-brus', classification: 'premier-cru' as const },
  { name: 'les-Chaniots', slug: 'les-chaniots', classification: 'premier-cru' as const },
  { name: 'les-Chazelles', slug: 'les-chazelles', classification: 'premier-cru' as const },
  { name: 'les-Cloux', slug: 'les-cloux', classification: 'premier-cru' as const },
  { name: 'les-Coeres', slug: 'les-coeres', classification: 'premier-cru' as const },
  { name: 'les-Corbaisons', slug: 'les-corbaisons', classification: 'premier-cru' as const },
  { name: 'les-Crets', slug: 'les-crets', classification: 'premier-cru' as const },
  { name: 'les-Dazes', slug: 'les-dazes', classification: 'premier-cru' as const },
  { name: 'les-Echeliers', slug: 'les-echeliers', classification: 'premier-cru' as const },
  { name: 'les-Feilles', slug: 'les-feilles', classification: 'premier-cru' as const },
  { name: 'les-Gouresses', slug: 'les-gouresses', classification: 'premier-cru' as const },
  { name: 'les-Guignottes', slug: 'les-guignottes', classification: 'premier-cru' as const },
  { name: 'les-Joncs', slug: 'les-joncs', classification: 'premier-cru' as const },
  { name: 'les-Marais', slug: 'les-marais', classification: 'premier-cru' as const },
  { name: 'les-Pendars', slug: 'les-pendars', classification: 'premier-cru' as const },
  { name: 'les-Plantats', slug: 'les-plantats', classification: 'premier-cru' as const },
  { name: 'les-Preaux', slug: 'les-preaux', classification: 'premier-cru' as const },
  { name: 'les-Pres', slug: 'les-pres', classification: 'premier-cru' as const },
  { name: 'les-Rougereaux', slug: 'les-rougereaux', classification: 'premier-cru' as const },
  { name: 'les-Thilles', slug: 'les-thilles', classification: 'premier-cru' as const },
  { name: 'les-Varignys', slug: 'les-varignys', classification: 'premier-cru' as const },
  { name: 'les-Variniers', slug: 'les-variniers', classification: 'premier-cru' as const },
  { name: 'les-Vignes-Sous-L-Eglise', slug: 'les-vignes-sous-l-eglise', classification: 'premier-cru' as const },
  { name: 'Montagny', slug: 'montagny', classification: 'premier-cru' as const },
  { name: 'Montcuchot', slug: 'montcuchot', classification: 'premier-cru' as const },
  { name: 'Pres-Berceaux', slug: 'pres-berceaux', classification: 'premier-cru' as const },
  { name: 'Sous-les-Roches', slug: 'sous-les-roches', classification: 'premier-cru' as const },
  { name: 'St-Vallerin', slug: 'st-vallerin', classification: 'premier-cru' as const },
  { name: 'Vignes-Dessous', slug: 'vignes-dessous', classification: 'premier-cru' as const },
] as const;

export default function MontagnyPage() {
  return (
    <RegionLayout
      title="Montagny"
      level="village"
      parentRegion="france/burgundy/cote-chalonnaise"
      sidebarLinks={MONTAGNY_VINEYARDS}
      contentFile="montagny-guide.md"
    />
  );
}
