import RegionLayout from '@/components/RegionLayout';

export default function LesCombottesPage() {
  return (
    <RegionLayout
      title="Les Combottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-combottes-guide.md"
    />
  );
}
