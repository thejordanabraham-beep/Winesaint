import RegionLayout from '@/components/RegionLayout';

export default function ClosdelaMoussePage() {
  return (
    <RegionLayout
      title="Clos de la Mousse"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="clos-de-la-mousse-guide.md"
    />
  );
}
