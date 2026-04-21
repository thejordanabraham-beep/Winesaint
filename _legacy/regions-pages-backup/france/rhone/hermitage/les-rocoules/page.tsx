import RegionLayout from '@/components/RegionLayout';

export default function LesRocoulesPage() {
  return (
    <RegionLayout
      title="Les Rocoules"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-rocoules-guide.md"
    />
  );
}
