import RegionLayout from '@/components/RegionLayout';

export default function SabarottePage() {
  return (
    <RegionLayout
      title="Sabarotte"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="sabarotte-guide.md"
    />
  );
}
