import RegionLayout from '@/components/RegionLayout';

export default function ClosRousseauPage() {
  return (
    <RegionLayout
      title="Clos Rousseau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="clos-rousseau-guide.md"
    />
  );
}
