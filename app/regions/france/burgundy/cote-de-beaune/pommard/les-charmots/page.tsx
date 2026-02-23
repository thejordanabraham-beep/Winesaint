import RegionLayout from '@/components/RegionLayout';

export default function LesCharmotsPage() {
  return (
    <RegionLayout
      title="Les Charmots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-charmots-guide.md"
    />
  );
}
