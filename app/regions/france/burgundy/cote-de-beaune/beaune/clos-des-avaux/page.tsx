import RegionLayout from '@/components/RegionLayout';

export default function ClosdesAvauxPage() {
  return (
    <RegionLayout
      title="Clos des Avaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="clos-des-avaux-guide.md"
    />
  );
}
