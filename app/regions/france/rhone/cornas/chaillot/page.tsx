import RegionLayout from '@/components/RegionLayout';

export default function ChaillotPage() {
  return (
    <RegionLayout
      title="Chaillot"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="chaillot-guide.md"
    />
  );
}
