import RegionLayout from '@/components/RegionLayout';

export default function GrandClosRousseauPage() {
  return (
    <RegionLayout
      title="Grand Clos Rousseau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/santenay"
      classification="premier-cru"
      contentFile="grand-clos-rousseau-guide.md"
    />
  );
}
