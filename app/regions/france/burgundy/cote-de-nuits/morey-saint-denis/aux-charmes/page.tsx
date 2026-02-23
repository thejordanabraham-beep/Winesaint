import RegionLayout from '@/components/RegionLayout';

export default function AuxCharmesPage() {
  return (
    <RegionLayout
      title="Aux Charmes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="aux-charmes-guide.md"
    />
  );
}
