import RegionLayout from '@/components/RegionLayout';

export default function AuxBousselotsPage() {
  return (
    <RegionLayout
      title="Aux Bousselots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="aux-bousselots-guide.md"
    />
  );
}
