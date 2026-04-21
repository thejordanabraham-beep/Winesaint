import RegionLayout from '@/components/RegionLayout';

export default function VaudesirPage() {
  return (
    <RegionLayout
      title="Vaudésir"
      level="vineyard"
      parentRegion="france/burgundy/chablis"
      classification="grand-cru"
      contentFile="vaudesir-guide.md"
    />
  );
}
