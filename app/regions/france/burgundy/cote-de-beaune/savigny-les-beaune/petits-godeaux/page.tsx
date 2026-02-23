import RegionLayout from '@/components/RegionLayout';

export default function PetitsGodeauxPage() {
  return (
    <RegionLayout
      title="Petits Godeaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/savigny-les-beaune"
      classification="premier-cru"
      contentFile="petits-godeaux-guide.md"
    />
  );
}
