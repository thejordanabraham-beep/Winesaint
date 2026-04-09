import RegionLayout from '@/components/RegionLayout';

export default function CumiresPage() {
  return (
    <RegionLayout
      title="Cumières"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="cumieres-guide.md"
    />
  );
}
