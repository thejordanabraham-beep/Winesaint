import RegionLayout from '@/components/RegionLayout';

export default function ChainesCarteauxPage() {
  return (
    <RegionLayout
      title="Chaines Carteaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="chaines-carteaux-guide.md"
    />
  );
}
