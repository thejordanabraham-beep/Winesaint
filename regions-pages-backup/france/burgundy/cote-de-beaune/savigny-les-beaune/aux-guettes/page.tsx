import RegionLayout from '@/components/RegionLayout';

export default function AuxGuettesPage() {
  return (
    <RegionLayout
      title="Aux Guettes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="aux-guettes-guide.md"
    />
  );
}
