import RegionLayout from '@/components/RegionLayout';

export default function AuxGravainsPage() {
  return (
    <RegionLayout
      title="Aux Gravains"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="aux-gravains-guide.md"
    />
  );
}
