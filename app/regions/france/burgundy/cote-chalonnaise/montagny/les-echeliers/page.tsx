import RegionLayout from '@/components/RegionLayout';

export default function LesEcheliersPage() {
  return (
    <RegionLayout
      title="Les Echeliers"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-echeliers-guide.md"
    />
  );
}
