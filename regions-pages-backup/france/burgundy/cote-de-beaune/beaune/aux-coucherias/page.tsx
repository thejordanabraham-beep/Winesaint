import RegionLayout from '@/components/RegionLayout';

export default function AuxCoucheriasPage() {
  return (
    <RegionLayout
      title="Aux Coucherias"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/beaune"
      classification="premier-cru"
      contentFile="aux-coucherias-guide.md"
    />
  );
}
