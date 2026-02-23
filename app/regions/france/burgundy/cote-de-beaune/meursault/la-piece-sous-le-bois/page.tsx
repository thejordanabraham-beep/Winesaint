import RegionLayout from '@/components/RegionLayout';

export default function LaPieceSousleBoisPage() {
  return (
    <RegionLayout
      title="La Piece Sous le Bois"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="la-piece-sous-le-bois-vineyard-guide.md"
    />
  );
}
