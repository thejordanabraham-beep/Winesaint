import RegionLayout from '@/components/RegionLayout';

export default function LesPlantesPage() {
  return (
    <RegionLayout
      title="Les Plantes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-plantes-guide.md"
    />
  );
}
