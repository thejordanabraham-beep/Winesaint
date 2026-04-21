import RegionLayout from '@/components/RegionLayout';

export default function LesVariniersPage() {
  return (
    <RegionLayout
      title="Les Variniers"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-variniers-guide.md"
    />
  );
}
