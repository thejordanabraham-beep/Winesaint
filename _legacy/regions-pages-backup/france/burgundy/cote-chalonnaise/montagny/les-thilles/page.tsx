import RegionLayout from '@/components/RegionLayout';

export default function LesThillesPage() {
  return (
    <RegionLayout
      title="Les Thilles"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-thilles-guide.md"
    />
  );
}
