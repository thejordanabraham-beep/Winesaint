import RegionLayout from '@/components/RegionLayout';

export default function LesArlettesPage() {
  return (
    <RegionLayout
      title="Les Arlettes"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="les-arlettes-guide.md"
    />
  );
}
