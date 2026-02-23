import RegionLayout from '@/components/RegionLayout';

export default function AuxClousPage() {
  return (
    <RegionLayout
      title="Aux Clous"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="aux-clous-guide.md"
    />
  );
}
