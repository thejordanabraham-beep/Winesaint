import RegionLayout from '@/components/RegionLayout';

export default function ClosdesGrandesVignesPage() {
  return (
    <RegionLayout
      title="Clos des Grandes Vignes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="clos-des-grandes-vignes-guide.md"
    />
  );
}
