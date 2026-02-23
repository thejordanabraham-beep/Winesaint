import RegionLayout from '@/components/RegionLayout';

export default function LesLavrottesPage() {
  return (
    <RegionLayout
      title="Les Lavrottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-lavrottes-guide.md"
    />
  );
}
