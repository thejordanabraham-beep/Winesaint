import RegionLayout from '@/components/RegionLayout';

export default function LesGrandesVignesPage() {
  return (
    <RegionLayout
      title="Les Grandes Vignes"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-grandes-vignes-guide.md"
    />
  );
}
