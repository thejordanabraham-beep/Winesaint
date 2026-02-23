import RegionLayout from '@/components/RegionLayout';

export default function AuxFourneauxPage() {
  return (
    <RegionLayout
      title="Aux Fourneaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="aux-fourneaux-guide.md"
    />
  );
}
