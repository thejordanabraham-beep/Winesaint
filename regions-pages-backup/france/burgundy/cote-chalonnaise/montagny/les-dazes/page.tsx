import RegionLayout from '@/components/RegionLayout';

export default function LesDazsPage() {
  return (
    <RegionLayout
      title="Les Dazés"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-dazes-guide.md"
    />
  );
}
