import RegionLayout from '@/components/RegionLayout';

const SAINTEMILION_CHATEAUX = [
  { name: 'Château Ausone', slug: 'chateau-ausone', classification: 'premier-grand-cru-classe-a' as const },
  { name: 'Château Cheval Blanc', slug: 'chateau-cheval-blanc', classification: 'premier-grand-cru-classe-a' as const },
  { name: 'Château Angélus', slug: 'chateau-angelus', classification: 'premier-grand-cru-classe-a' as const },
  { name: 'Château Pavie', slug: 'chateau-pavie', classification: 'premier-grand-cru-classe-a' as const },
  { name: 'Château Figeac', slug: 'chateau-figeac', classification: 'premier-grand-cru-classe-b' as const },
  { name: 'Château Canon', slug: 'chateau-canon', classification: 'premier-grand-cru-classe-b' as const },
];

export default function SaintEmilionPage() {
  return (
    <RegionLayout
      title="Saint-Émilion"
      level="village"
      parentRegion="france/bordeaux/right-bank"
      sidebarLinks={SAINTEMILION_CHATEAUX}
      contentFile="saint-emilion-guide.md"
    />
  );
}
