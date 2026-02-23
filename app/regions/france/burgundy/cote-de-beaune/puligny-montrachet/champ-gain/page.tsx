import RegionLayout from '@/components/RegionLayout';

export default function ChampGainPage() {
  return (
    <RegionLayout
      title="Champ Gain"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="champ-gain-guide.md"
    />
  );
}
