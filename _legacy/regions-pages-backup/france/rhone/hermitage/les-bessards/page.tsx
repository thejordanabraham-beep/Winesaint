import RegionLayout from '@/components/RegionLayout';

export default function LesBessardsPage() {
  return (
    <RegionLayout
      title="Les Bessards"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-bessards-guide.md"
    />
  );
}
