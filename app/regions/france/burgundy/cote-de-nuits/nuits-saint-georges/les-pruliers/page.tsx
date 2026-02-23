import RegionLayout from '@/components/RegionLayout';

export default function LesPruliersPage() {
  return (
    <RegionLayout
      title="Les Pruliers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-pruliers-guide.md"
    />
  );
}
