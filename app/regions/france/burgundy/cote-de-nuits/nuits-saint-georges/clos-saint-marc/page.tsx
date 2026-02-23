import RegionLayout from '@/components/RegionLayout';

export default function ClosSaintMarcPage() {
  return (
    <RegionLayout
      title="Clos Saint-Marc"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="clos-saint-marc-guide.md"
    />
  );
}
