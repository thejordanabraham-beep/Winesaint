import RegionLayout from '@/components/RegionLayout';

export default function LesDamodesPage() {
  return (
    <RegionLayout
      title="Les Damodes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-damodes-guide.md"
    />
  );
}
