import RegionLayout from '@/components/RegionLayout';

export default function LesBrouillardsPage() {
  return (
    <RegionLayout
      title="Les Brouillards"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="les-brouillards-guide.md"
    />
  );
}
