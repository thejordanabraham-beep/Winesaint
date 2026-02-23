import RegionLayout from '@/components/RegionLayout';

export default function TzierPage() {
  return (
    <RegionLayout
      title="Tézier"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="tezier-guide.md"
    />
  );
}
