import RegionLayout from '@/components/RegionLayout';

export default function AuxChaignotsPage() {
  return (
    <RegionLayout
      title="Aux Chaignots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="aux-chaignots-guide.md"
    />
  );
}
