import RegionLayout from '@/components/RegionLayout';

export default function LaPlantePage() {
  return (
    <RegionLayout
      title="La Plante"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="la-plante-guide.md"
    />
  );
}
