import RegionLayout from '@/components/RegionLayout';

export default function RaclotPage() {
  return (
    <RegionLayout
      title="Raclot"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="raclot-guide.md"
    />
  );
}
