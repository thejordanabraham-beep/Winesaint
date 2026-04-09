import RegionLayout from '@/components/RegionLayout';

export default function LesEygasPage() {
  return (
    <RegionLayout
      title="Les Eygas"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="les-eygas-guide.md"
    />
  );
}
