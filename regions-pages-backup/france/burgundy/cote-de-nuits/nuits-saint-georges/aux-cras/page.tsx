import RegionLayout from '@/components/RegionLayout';

export default function AuxCrasPage() {
  return (
    <RegionLayout
      title="Aux Cras"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="aux-cras-guide.md"
    />
  );
}
