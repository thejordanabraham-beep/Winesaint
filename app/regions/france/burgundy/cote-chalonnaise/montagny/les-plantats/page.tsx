import RegionLayout from '@/components/RegionLayout';

export default function LesPlantatsPage() {
  return (
    <RegionLayout
      title="Les Plantats"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-plantats-guide.md"
    />
  );
}
