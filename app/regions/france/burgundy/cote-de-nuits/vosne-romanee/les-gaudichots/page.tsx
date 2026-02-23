import RegionLayout from '@/components/RegionLayout';

export default function LesGaudichotsPage() {
  return (
    <RegionLayout
      title="Les Gaudichots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="les-gaudichots-guide.md"
    />
  );
}
