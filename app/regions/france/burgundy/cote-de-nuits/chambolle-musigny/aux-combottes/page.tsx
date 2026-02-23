import RegionLayout from '@/components/RegionLayout';

export default function AuxCombottesPage() {
  return (
    <RegionLayout
      title="Aux Combottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="aux-combottes-guide.md"
    />
  );
}
