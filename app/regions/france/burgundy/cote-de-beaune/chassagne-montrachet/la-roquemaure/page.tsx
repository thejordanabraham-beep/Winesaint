import RegionLayout from '@/components/RegionLayout';

export default function LaRoquemaurePage() {
  return (
    <RegionLayout
      title="La Roquemaure"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="la-roquemaure-vineyard-guide.md"
    />
  );
}
