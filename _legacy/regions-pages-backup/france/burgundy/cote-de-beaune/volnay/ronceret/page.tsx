import RegionLayout from '@/components/RegionLayout';

export default function RonceretPage() {
  return (
    <RegionLayout
      title="Ronceret"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="ronceret-guide.md"
    />
  );
}
