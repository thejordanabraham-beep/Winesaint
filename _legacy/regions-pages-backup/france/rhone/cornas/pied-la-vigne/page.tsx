import RegionLayout from '@/components/RegionLayout';

export default function PiedlaVignePage() {
  return (
    <RegionLayout
      title="Pied la Vigne"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="pied-la-vigne-guide.md"
    />
  );
}
