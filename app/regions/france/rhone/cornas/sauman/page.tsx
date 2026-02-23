import RegionLayout from '@/components/RegionLayout';

export default function SaumanPage() {
  return (
    <RegionLayout
      title="Sauman"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="sauman-guide.md"
    />
  );
}
