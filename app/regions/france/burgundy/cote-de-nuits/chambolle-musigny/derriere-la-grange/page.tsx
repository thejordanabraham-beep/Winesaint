import RegionLayout from '@/components/RegionLayout';

export default function DerrirelaGrangePage() {
  return (
    <RegionLayout
      title="Derrière la Grange"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="derriere-la-grange-guide.md"
    />
  );
}
