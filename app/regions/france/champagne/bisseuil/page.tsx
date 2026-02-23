import RegionLayout from '@/components/RegionLayout';

export default function BisseuilPage() {
  return (
    <RegionLayout
      title="Bisseuil"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="bisseuil-guide.md"
    />
  );
}
