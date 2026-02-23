import RegionLayout from '@/components/RegionLayout';

export default function LesNoirotsPage() {
  return (
    <RegionLayout
      title="Les Noirots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-noirots-guide.md"
    />
  );
}
