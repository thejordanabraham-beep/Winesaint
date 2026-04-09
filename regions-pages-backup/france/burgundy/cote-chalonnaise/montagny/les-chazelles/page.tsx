import RegionLayout from '@/components/RegionLayout';

export default function LesChazellesPage() {
  return (
    <RegionLayout
      title="Les Chazelles"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-chazelles-guide.md"
    />
  );
}
