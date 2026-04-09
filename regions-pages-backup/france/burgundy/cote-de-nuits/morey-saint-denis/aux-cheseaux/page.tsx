import RegionLayout from '@/components/RegionLayout';

export default function AuxCheseauxPage() {
  return (
    <RegionLayout
      title="Aux Cheseaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="aux-cheseaux-guide.md"
    />
  );
}
