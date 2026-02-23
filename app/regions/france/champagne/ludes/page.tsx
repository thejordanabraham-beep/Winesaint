import RegionLayout from '@/components/RegionLayout';

export default function LudesPage() {
  return (
    <RegionLayout
      title="Ludes"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="ludes-guide.md"
    />
  );
}
