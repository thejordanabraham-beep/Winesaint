import RegionLayout from '@/components/RegionLayout';

export default function PetitClosRousseauPage() {
  return (
    <RegionLayout
      title="Petit Clos Rousseau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="petit-clos-rousseau-guide.md"
    />
  );
}
