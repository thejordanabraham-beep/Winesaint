import RegionLayout from '@/components/RegionLayout';

export default function AmbonnayPage() {
  return (
    <RegionLayout
      title="Ambonnay"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="ambonnay-guide.md"
    />
  );
}
