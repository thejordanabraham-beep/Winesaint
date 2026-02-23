import RegionLayout from '@/components/RegionLayout';

export default function CtedeJouanPage() {
  return (
    <RegionLayout
      title="Côte de Jouan"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="cote-de-jouan-guide.md"
    />
  );
}
