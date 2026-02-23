import RegionLayout from '@/components/RegionLayout';

export default function OiryPage() {
  return (
    <RegionLayout
      title="Oiry"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="oiry-guide.md"
    />
  );
}
