import RegionLayout from '@/components/RegionLayout';

export default function CuisPage() {
  return (
    <RegionLayout
      title="Cuis"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="cuis-guide.md"
    />
  );
}
