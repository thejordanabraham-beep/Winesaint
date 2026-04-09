import RegionLayout from '@/components/RegionLayout';

export default function LaMaladirePage() {
  return (
    <RegionLayout
      title="La Maladière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="la-maladiere-guide.md"
    />
  );
}
