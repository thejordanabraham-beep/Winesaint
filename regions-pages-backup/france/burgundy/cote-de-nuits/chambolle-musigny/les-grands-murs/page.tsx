import RegionLayout from '@/components/RegionLayout';

export default function LesGrandsMursPage() {
  return (
    <RegionLayout
      title="Les Grands Murs"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-grands-murs-guide.md"
    />
  );
}
