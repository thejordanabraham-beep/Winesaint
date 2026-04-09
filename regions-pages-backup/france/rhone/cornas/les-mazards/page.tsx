import RegionLayout from '@/components/RegionLayout';

export default function LesMazardsPage() {
  return (
    <RegionLayout
      title="Les Mazards"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="les-mazards-guide.md"
    />
  );
}
