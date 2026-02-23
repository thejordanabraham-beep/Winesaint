import RegionLayout from '@/components/RegionLayout';

export default function MontedeTonnerrePage() {
  return (
    <RegionLayout
      title="Montée de Tonnerre"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="premier-cru"
      contentFile="montee-de-tonnerre-guide.md"
    />
  );
}
