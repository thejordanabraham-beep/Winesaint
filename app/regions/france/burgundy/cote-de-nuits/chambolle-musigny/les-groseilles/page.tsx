import RegionLayout from '@/components/RegionLayout';

export default function LesGroseillesPage() {
  return (
    <RegionLayout
      title="Les Groseilles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-groseilles-guide.md"
    />
  );
}
