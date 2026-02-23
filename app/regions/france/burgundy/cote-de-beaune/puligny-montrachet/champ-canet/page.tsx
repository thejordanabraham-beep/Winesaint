import RegionLayout from '@/components/RegionLayout';

export default function ChampCanetPage() {
  return (
    <RegionLayout
      title="Champ Canet"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="champ-canet-guide.md"
    />
  );
}
