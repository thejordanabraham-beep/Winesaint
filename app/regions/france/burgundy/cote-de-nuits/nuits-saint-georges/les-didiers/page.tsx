import RegionLayout from '@/components/RegionLayout';

export default function LesDidiersPage() {
  return (
    <RegionLayout
      title="Les Didiers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-didiers-guide.md"
    />
  );
}
