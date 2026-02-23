import RegionLayout from '@/components/RegionLayout';

export default function RuedeChauxPage() {
  return (
    <RegionLayout
      title="Rue de Chaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="rue-de-chaux-guide.md"
    />
  );
}
