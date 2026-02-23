import RegionLayout from '@/components/RegionLayout';

export default function LaTruffirePage() {
  return (
    <RegionLayout
      title="La Truffière"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="la-truffiere-guide.md"
    />
  );
}
