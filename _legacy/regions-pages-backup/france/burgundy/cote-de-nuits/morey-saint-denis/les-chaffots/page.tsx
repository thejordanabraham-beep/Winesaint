import RegionLayout from '@/components/RegionLayout';

export default function LesChaffotsPage() {
  return (
    <RegionLayout
      title="Les Chaffots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="les-chaffots-guide.md"
    />
  );
}
