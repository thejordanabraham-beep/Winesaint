import RegionLayout from '@/components/RegionLayout';

export default function LesVignesRondesPage() {
  return (
    <RegionLayout
      title="Les Vignes Rondes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="les-vignes-rondes-guide.md"
    />
  );
}
