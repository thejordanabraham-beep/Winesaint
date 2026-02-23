import RegionLayout from '@/components/RegionLayout';

export default function LesCtesPage() {
  return (
    <RegionLayout
      title="Les Côtes"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="les-cotes-guide.md"
    />
  );
}
