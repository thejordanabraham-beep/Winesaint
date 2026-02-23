import RegionLayout from '@/components/RegionLayout';

export default function AuxBoudotsPage() {
  return (
    <RegionLayout
      title="Aux Boudots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="aux-boudots-guide.md"
    />
  );
}
