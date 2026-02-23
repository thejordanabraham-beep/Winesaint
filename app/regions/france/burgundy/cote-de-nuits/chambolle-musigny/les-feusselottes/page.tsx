import RegionLayout from '@/components/RegionLayout';

export default function LesFeusselottesPage() {
  return (
    <RegionLayout
      title="Les Feusselottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-feusselottes-guide.md"
    />
  );
}
