import RegionLayout from '@/components/RegionLayout';

export default function EnGrandsVauxPage() {
  return (
    <RegionLayout
      title="En Grands Vaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/marsannay"
      classification="premier-cru"
      contentFile="en-grands-vaux-guide.md"
    />
  );
}
