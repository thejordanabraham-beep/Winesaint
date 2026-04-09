import RegionLayout from '@/components/RegionLayout';

export default function LesChabiotsPage() {
  return (
    <RegionLayout
      title="Les Chabiots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-chabiots-guide.md"
    />
  );
}
