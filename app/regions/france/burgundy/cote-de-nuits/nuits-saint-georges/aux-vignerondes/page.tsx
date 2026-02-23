import RegionLayout from '@/components/RegionLayout';

export default function AuxVignerondesPage() {
  return (
    <RegionLayout
      title="Aux Vignerondes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="aux-vignerondes-guide.md"
    />
  );
}
