import RegionLayout from '@/components/RegionLayout';

export default function SouslePuitsPage() {
  return (
    <RegionLayout
      title="Sous le Puits"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="sous-le-puits-guide.md"
    />
  );
}
