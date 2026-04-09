import RegionLayout from '@/components/RegionLayout';

const CHATEAUNEUFDUPAPE_PRODUCERS = [
  { name: 'Château Rayas', slug: 'chateau-rayas', classification: 'single-vineyard' as const },
  { name: 'Domaine du Vieux Télégraphe', slug: 'domaine-du-vieux-telegraphe', classification: 'single-vineyard' as const },
  { name: 'Château de Beaucastel', slug: 'chateau-de-beaucastel', classification: 'single-vineyard' as const },
  { name: 'Domaine de la Janasse', slug: 'domaine-de-la-janasse', classification: 'single-vineyard' as const },
];

export default function ChateauneufduPapePage() {
  return (
    <RegionLayout
      title="Châteauneuf-du-Pape"
      level="sub-region"
      parentRegion="france/rhone-valley"
      sidebarLinks={CHATEAUNEUFDUPAPE_PRODUCERS}
      contentFile="chateauneuf-du-pape-guide.md"
    />
  );
}
