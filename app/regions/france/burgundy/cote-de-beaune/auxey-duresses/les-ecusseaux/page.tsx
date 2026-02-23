import RegionLayout from '@/components/RegionLayout';

export default function LescusseauxPage() {
  return (
    <RegionLayout
      title="Les Écusseaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="les-ecusseaux-guide.md"
    />
  );
}
