import RegionLayout from '@/components/RegionLayout';

export default function LesClouxPage() {
  return (
    <RegionLayout
      title="Les Cloux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-cloux-guide.md"
    />
  );
}
