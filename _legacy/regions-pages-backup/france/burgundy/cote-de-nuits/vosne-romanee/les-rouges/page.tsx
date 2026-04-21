import RegionLayout from '@/components/RegionLayout';

export default function LesRougesPage() {
  return (
    <RegionLayout
      title="Les Rouges"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="les-rouges-guide.md"
    />
  );
}
