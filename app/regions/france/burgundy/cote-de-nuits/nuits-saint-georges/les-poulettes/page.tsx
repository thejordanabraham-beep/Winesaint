import RegionLayout from '@/components/RegionLayout';

export default function LesPoulettesPage() {
  return (
    <RegionLayout
      title="Les Poulettes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-poulettes-guide.md"
    />
  );
}
