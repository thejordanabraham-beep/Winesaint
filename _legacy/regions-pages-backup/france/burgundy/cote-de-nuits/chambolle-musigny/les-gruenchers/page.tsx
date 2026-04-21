import RegionLayout from '@/components/RegionLayout';

export default function LesGruenchersPage() {
  return (
    <RegionLayout
      title="Les Gruenchers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-gruenchers-guide.md"
    />
  );
}
