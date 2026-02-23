import RegionLayout from '@/components/RegionLayout';

export default function LesChaboeufsPage() {
  return (
    <RegionLayout
      title="Les Chaboeufs"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-chaboeufs-guide.md"
    />
  );
}
