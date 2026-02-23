import RegionLayout from '@/components/RegionLayout';

export default function AuxEchangesPage() {
  return (
    <RegionLayout
      title="Aux Echanges"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="aux-echanges-guide.md"
    />
  );
}
