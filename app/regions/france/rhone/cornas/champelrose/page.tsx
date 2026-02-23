import RegionLayout from '@/components/RegionLayout';

export default function ChampelrosePage() {
  return (
    <RegionLayout
      title="Champelrose"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="champelrose-guide.md"
    />
  );
}
