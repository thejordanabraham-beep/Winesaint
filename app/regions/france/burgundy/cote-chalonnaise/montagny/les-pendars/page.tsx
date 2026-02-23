import RegionLayout from '@/components/RegionLayout';

export default function LesPendarsPage() {
  return (
    <RegionLayout
      title="Les Pendars"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-pendars-guide.md"
    />
  );
}
