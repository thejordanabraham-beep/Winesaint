import RegionLayout from '@/components/RegionLayout';

export default function LesMontrevenotsPage() {
  return (
    <RegionLayout
      title="Les Montrevenots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-montrevenots-guide.md"
    />
  );
}
