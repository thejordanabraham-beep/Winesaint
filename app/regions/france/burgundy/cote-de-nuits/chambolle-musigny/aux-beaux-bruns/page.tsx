import RegionLayout from '@/components/RegionLayout';

export default function AuxBeauxBrunsPage() {
  return (
    <RegionLayout
      title="Aux Beaux Bruns"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="aux-beaux-bruns-guide.md"
    />
  );
}
