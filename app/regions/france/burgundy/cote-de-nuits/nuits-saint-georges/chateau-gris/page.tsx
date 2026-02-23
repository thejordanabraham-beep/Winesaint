import RegionLayout from '@/components/RegionLayout';

export default function ChteauGrisPage() {
  return (
    <RegionLayout
      title="Château Gris"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="chateau-gris-guide.md"
    />
  );
}
