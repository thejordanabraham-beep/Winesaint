import RegionLayout from '@/components/RegionLayout';

export default function LesMuretsPage() {
  return (
    <RegionLayout
      title="Les Murets"
      level="vineyard"
      parentRegion="france/rhone/hermitage"
      classification="climat"
      contentFile="les-murets-guide.md"
    />
  );
}
