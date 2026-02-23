import RegionLayout from '@/components/RegionLayout';

export default function LesTerresBlanchesPage() {
  return (
    <RegionLayout
      title="Les Terres Blanches"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-terres-blanches-guide.md"
    />
  );
}
