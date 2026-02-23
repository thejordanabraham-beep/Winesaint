import RegionLayout from '@/components/RegionLayout';

export default function AuxRaignotsPage() {
  return (
    <RegionLayout
      title="Aux Raignots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="aux-raignots-vineyard-guide.md"
    />
  );
}
