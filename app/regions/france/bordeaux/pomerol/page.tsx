import RegionLayout from '@/components/RegionLayout';

const POMEROL_CHATEAUX = [
  { name: 'Château Pétrus', slug: 'chateau-petrus', classification: 'single-vineyard' as const },
  { name: 'Château Le Pin', slug: 'chateau-le-pin', classification: 'single-vineyard' as const },
  { name: 'Château Lafleur', slug: 'chateau-lafleur', classification: 'single-vineyard' as const },
  { name: 'Vieux Château Certan', slug: 'vieux-chateau-certan', classification: 'single-vineyard' as const },
  { name: 'Château Trotanoy', slug: 'chateau-trotanoy', classification: 'single-vineyard' as const },
  { name: "Château L'Évangile", slug: 'chateau-levangile', classification: 'single-vineyard' as const },
];

export default function PomerolPage() {
  return (
    <RegionLayout
      title="Pomerol"
      level="sub-region"
      parentRegion="france/bordeaux"
      sidebarLinks={POMEROL_CHATEAUX}
      contentFile="pomerol-guide.md"
    />
  );
}
