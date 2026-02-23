import RegionLayout from '@/components/RegionLayout';

export default function BlanchesFleursPage() {
  return (
    <RegionLayout
      title="Blanches Fleurs"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="blanches-fleurs-guide.md"
    />
  );
}
