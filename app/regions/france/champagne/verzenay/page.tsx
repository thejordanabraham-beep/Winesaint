import RegionLayout from '@/components/RegionLayout';

export default function VerzenayPage() {
  return (
    <RegionLayout
      title="Verzenay"
      level="vineyard"
      parentRegion="france/champagne"
      classification="grand-cru"
      contentFile="verzenay-guide.md"
    />
  );
}
