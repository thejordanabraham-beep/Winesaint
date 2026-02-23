import RegionLayout from '@/components/RegionLayout';

export default function PetiteCtePage() {
  return (
    <RegionLayout
      title="Petite Côte"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="petite-cote-guide.md"
    />
  );
}
