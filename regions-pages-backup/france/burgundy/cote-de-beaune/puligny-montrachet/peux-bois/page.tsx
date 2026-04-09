import RegionLayout from '@/components/RegionLayout';

export default function PeuxBoisPage() {
  return (
    <RegionLayout
      title="Peux Bois"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="peux-bois-guide.md"
    />
  );
}
