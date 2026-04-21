import RegionLayout from '@/components/RegionLayout';

export default function LaCoutirePage() {
  return (
    <RegionLayout
      title="La Coutière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/aloxe-corton"
      classification="premier-cru"
      contentFile="la-coutiere-guide.md"
    />
  );
}
