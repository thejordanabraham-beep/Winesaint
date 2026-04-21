import RegionLayout from '@/components/RegionLayout';

const COTEROTIE_PRODUCERS = [
  { name: 'Domaine Jamet', slug: 'domaine-jamet', classification: 'single-vineyard' as const },
  { name: 'E. Guigal', slug: 'e-guigal', classification: 'single-vineyard' as const },
  { name: 'René Rostaing', slug: 'rene-rostaing', classification: 'single-vineyard' as const },
];

export default function CoteRotiePage() {
  return (
    <RegionLayout
      title="Côte-Rôtie"
      level="sub-region"
      parentRegion="france/rhone-valley"
      sidebarLinks={COTEROTIE_PRODUCERS}
      contentFile="cote-rotie-guide.md"
    />
  );
}
