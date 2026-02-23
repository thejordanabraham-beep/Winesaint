import RegionLayout from '@/components/RegionLayout';

export default function TourssurMarnePage() {
  return (
    <RegionLayout
      title="Tours-sur-Marne"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="tours-sur-marne-guide.md"
    />
  );
}
