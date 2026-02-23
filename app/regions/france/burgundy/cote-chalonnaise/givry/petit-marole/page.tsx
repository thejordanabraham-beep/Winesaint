import RegionLayout from '@/components/RegionLayout';

export default function PetitMarolePage() {
  return (
    <RegionLayout
      title="Petit Marole"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="petit-marole-guide.md"
    />
  );
}
