import RegionLayout from '@/components/RegionLayout';

export default function SermiersPage() {
  return (
    <RegionLayout
      title="Sermiers"
      level="vineyard"
      parentRegion="france/champagne"
      classification="premier-cru"
      contentFile="sermiers-guide.md"
    />
  );
}
