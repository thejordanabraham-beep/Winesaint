import RegionLayout from '@/components/RegionLayout';

export default function LesCaillesPage() {
  return (
    <RegionLayout
      title="Les Cailles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-cailles-guide.md"
    />
  );
}
