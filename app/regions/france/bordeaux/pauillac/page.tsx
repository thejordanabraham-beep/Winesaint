import RegionLayout from '@/components/RegionLayout';

const PAUILLAC_CHATEAUX = [
  { name: 'Château Lafite Rothschild', slug: 'chateau-lafite-rothschild', classification: '1er-cru-classe' as const },
  { name: 'Château Latour', slug: 'chateau-latour', classification: '1er-cru-classe' as const },
  { name: 'Château Mouton Rothschild', slug: 'chateau-mouton-rothschild', classification: '1er-cru-classe' as const },
  { name: 'Château Pichon-Longueville', slug: 'chateau-pichon-longueville', classification: '2eme-cru-classe' as const },
  { name: 'Château Pichon-Longueville Comtesse de Lalande', slug: 'chateau-pichon-longueville-comtesse-de-lalande', classification: '2eme-cru-classe' as const },
  { name: 'Château Duhart-Milon', slug: 'chateau-duhart-milon', classification: '4eme-cru-classe' as const },
  { name: 'Château Pontet-Canet', slug: 'chateau-pontet-canet', classification: '5eme-cru-classe' as const },
  { name: 'Château Lynch-Bages', slug: 'chateau-lynch-bages', classification: '5eme-cru-classe' as const },
  { name: 'Château Grand-Puy-Lacoste', slug: 'chateau-grand-puy-lacoste', classification: '5eme-cru-classe' as const },
];

export default function PauillacPage() {
  return (
    <RegionLayout
      title="Pauillac"
      level="sub-region"
      parentRegion="france/bordeaux"
      sidebarLinks={PAUILLAC_CHATEAUX}
      contentFile="pauillac-guide.md"
    />
  );
}
