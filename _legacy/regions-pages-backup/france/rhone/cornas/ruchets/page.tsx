import RegionLayout from '@/components/RegionLayout';

export default function RuchetsPage() {
  return (
    <RegionLayout
      title="Ruchets"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="ruchets-guide.md"
    />
  );
}
