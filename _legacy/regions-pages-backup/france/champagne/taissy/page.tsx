import RegionLayout from '@/components/RegionLayout';

export default function TaissyPage() {
  return (
    <RegionLayout
      title="Taissy"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="taissy-guide.md"
    />
  );
}
