import RegionLayout from '@/components/RegionLayout';

export default function SacyPage() {
  return (
    <RegionLayout
      title="Sacy"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="sacy-guide.md"
    />
  );
}
