import RegionLayout from '@/components/RegionLayout';

const RULLY_VINEYARDS = [
  { name: 'Agneux', slug: 'agneux', classification: 'premier-cru' as const },
  { name: 'Champs-Cloux', slug: 'champs-cloux', classification: 'premier-cru' as const },
  { name: 'Chapitre', slug: 'chapitre', classification: 'premier-cru' as const },
  { name: 'Clos-du-Chaigne', slug: 'clos-du-chaigne', classification: 'premier-cru' as const },
  { name: 'Clos-Saint-Jacques', slug: 'clos-saint-jacques', classification: 'premier-cru' as const },
  { name: 'Cloux', slug: 'cloux', classification: 'premier-cru' as const },
  { name: 'Gresigny', slug: 'gresigny', classification: 'premier-cru' as const },
  { name: 'la-Bressande', slug: 'la-bressande', classification: 'premier-cru' as const },
  { name: 'la-Fosse', slug: 'la-fosse', classification: 'premier-cru' as const },
  { name: 'la-Pucelle', slug: 'la-pucelle', classification: 'premier-cru' as const },
  { name: 'la-Renarde', slug: 'la-renarde', classification: 'premier-cru' as const },
  { name: 'le-Meix-Cadot', slug: 'le-meix-cadot', classification: 'premier-cru' as const },
  { name: 'le-Meix-Caillet', slug: 'le-meix-caillet', classification: 'premier-cru' as const },
  { name: 'les-Pierres', slug: 'les-pierres', classification: 'premier-cru' as const },
  { name: 'Margotes', slug: 'margotes', classification: 'premier-cru' as const },
  { name: 'Marissou', slug: 'marissou', classification: 'premier-cru' as const },
  { name: 'Molesme', slug: 'molesme', classification: 'premier-cru' as const },
  { name: 'Montpalais', slug: 'montpalais', classification: 'premier-cru' as const },
  { name: 'Pillot', slug: 'pillot', classification: 'premier-cru' as const },
  { name: 'Preaux', slug: 'preaux', classification: 'premier-cru' as const },
  { name: 'Rabource', slug: 'rabource', classification: 'premier-cru' as const },
  { name: 'Raclot', slug: 'raclot', classification: 'premier-cru' as const },
  { name: 'Vauvry', slug: 'vauvry', classification: 'premier-cru' as const },
] as const;

export default function RullyPage() {
  return (
    <RegionLayout
      title="Rully"
      level="village"
      parentRegion="france/burgundy/cote-chalonnaise"
      sidebarLinks={RULLY_VINEYARDS}
      contentFile="rully-guide.md"
    />
  );
}
