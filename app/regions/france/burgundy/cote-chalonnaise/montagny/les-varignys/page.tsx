import RegionLayout from '@/components/RegionLayout';

export default function LesVarignysPage() {
  return (
    <RegionLayout
      title="Les Varignys"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-varignys-guide.md"
    />
  );
}
