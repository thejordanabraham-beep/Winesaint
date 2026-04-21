import RegionLayout from '@/components/RegionLayout';

export default function AuxMurgersPage() {
  return (
    <RegionLayout
      title="Aux Murgers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="aux-murgers-guide.md"
    />
  );
}
