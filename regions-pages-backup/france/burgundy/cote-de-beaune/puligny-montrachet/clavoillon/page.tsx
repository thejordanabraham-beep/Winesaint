import RegionLayout from '@/components/RegionLayout';

export default function ClavoillonPage() {
  return (
    <RegionLayout
      title="Clavoillon"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/puligny-montrachet"
      classification="premier-cru"
      contentFile="clavoillon-guide.md"
    />
  );
}
