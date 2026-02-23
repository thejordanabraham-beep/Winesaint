import RegionLayout from '@/components/RegionLayout';

export default function MontpalaisPage() {
  return (
    <RegionLayout
      title="Montpalais"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="montpalais-guide.md"
    />
  );
}
