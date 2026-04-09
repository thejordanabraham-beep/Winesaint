import RegionLayout from '@/components/RegionLayout';

export default function JouvetPage() {
  return (
    <RegionLayout
      title="Jouvet"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="jouvet-guide.md"
    />
  );
}
