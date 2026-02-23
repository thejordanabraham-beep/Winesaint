import RegionLayout from '@/components/RegionLayout';

export default function LaChanirePage() {
  return (
    <RegionLayout
      title="La Chanière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="la-chaniere-guide.md"
    />
  );
}
