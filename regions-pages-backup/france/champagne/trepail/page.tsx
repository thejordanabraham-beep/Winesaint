import RegionLayout from '@/components/RegionLayout';

export default function TrpailPage() {
  return (
    <RegionLayout
      title="Trépail"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="trepail-guide.md"
    />
  );
}
