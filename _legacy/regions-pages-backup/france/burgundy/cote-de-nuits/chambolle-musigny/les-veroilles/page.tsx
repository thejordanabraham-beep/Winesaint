import RegionLayout from '@/components/RegionLayout';

export default function LesVroillesPage() {
  return (
    <RegionLayout
      title="Les Véroilles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-veroilles-guide.md"
    />
  );
}
