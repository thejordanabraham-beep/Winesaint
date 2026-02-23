import RegionLayout from '@/components/RegionLayout';

export default function LesHautsPruliersPage() {
  return (
    <RegionLayout
      title="Les Hauts Pruliers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/nuits-saint-georges"
      classification="premier-cru"
      contentFile="les-hauts-pruliers-guide.md"
    />
  );
}
