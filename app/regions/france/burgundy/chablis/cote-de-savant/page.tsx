import RegionLayout from '@/components/RegionLayout';

export default function CtedeSavantPage() {
  return (
    <RegionLayout
      title="Côte de Savant"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="cote-de-savant-guide.md"
    />
  );
}
