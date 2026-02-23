import RegionLayout from '@/components/RegionLayout';

const SAINTJULIEN_CHATEAUX = [
  { name: 'Château Léoville-Las Cases', slug: 'chateau-leoville-las-cases', classification: '2eme-cru-classe' as const },
  { name: 'Château Léoville-Poyferré', slug: 'chateau-leoville-poyferre', classification: '2eme-cru-classe' as const },
  { name: 'Château Léoville-Barton', slug: 'chateau-leoville-barton', classification: '2eme-cru-classe' as const },
  { name: 'Château Ducru-Beaucaillou', slug: 'chateau-ducru-beaucaillou', classification: '2eme-cru-classe' as const },
  { name: 'Château Gruaud-Larose', slug: 'chateau-gruaud-larose', classification: '2eme-cru-classe' as const },
  { name: 'Château Beychevelle', slug: 'chateau-beychevelle', classification: '4eme-cru-classe' as const },
];

export default function SaintJulienPage() {
  return (
    <RegionLayout
      title="Saint-Julien"
      level="sub-region"
      parentRegion="france/bordeaux"
      sidebarLinks={SAINTJULIEN_CHATEAUX}
      contentFile="saint-julien-guide.md"
    />
  );
}
