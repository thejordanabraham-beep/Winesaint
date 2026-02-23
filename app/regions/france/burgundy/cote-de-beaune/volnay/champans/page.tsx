import RegionLayout from '@/components/RegionLayout';

export default function ChampansPage() {
  return (
    <RegionLayout
      title="Champans"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/volnay"
      classification="premier-cru"
      contentFile="champans-guide.md"
    />
  );
}
