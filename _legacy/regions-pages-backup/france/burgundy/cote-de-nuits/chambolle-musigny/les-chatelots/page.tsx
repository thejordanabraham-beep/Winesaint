import RegionLayout from '@/components/RegionLayout';

export default function LesChatelotsPage() {
  return (
    <RegionLayout
      title="Les Chatelots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-chatelots-guide.md"
    />
  );
}
