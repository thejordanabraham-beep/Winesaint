import RegionLayout from '@/components/RegionLayout';

export default function LesCrotsPage() {
  return (
    <RegionLayout
      title="Les Crots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-crots-guide.md"
    />
  );
}
