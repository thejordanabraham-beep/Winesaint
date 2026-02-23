import RegionLayout from '@/components/RegionLayout';

export default function LesCentsVignesPage() {
  return (
    <RegionLayout
      title="Les Cents Vignes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="les-cents-vignes-guide.md"
    />
  );
}
