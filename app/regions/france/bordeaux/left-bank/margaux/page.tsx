import RegionLayout from '@/components/RegionLayout';

const MARGAUX_CHATEAUX = [
  { name: 'Château Margaux', slug: 'chateau-margaux', classification: '1er-cru-classe' as const },
  { name: 'Château Rauzan-Ségla', slug: 'chateau-rauzan-segla', classification: '2eme-cru-classe' as const },
  { name: 'Château Rauzan-Gassies', slug: 'chateau-rauzan-gassies', classification: '2eme-cru-classe' as const },
  { name: 'Château Durfort-Vivens', slug: 'chateau-durfort-vivens', classification: '2eme-cru-classe' as const },
  { name: 'Château Lascombes', slug: 'chateau-lascombes', classification: '2eme-cru-classe' as const },
  { name: 'Château Palmer', slug: 'chateau-palmer', classification: '3eme-cru-classe' as const },
];

export default function MargauxPage() {
  return (
    <RegionLayout
      title="Margaux"
      level="village"
      parentRegion="france/bordeaux/left-bank"
      sidebarLinks={MARGAUX_CHATEAUX}
      contentFile="margaux-guide.md"
    />
  );
}
