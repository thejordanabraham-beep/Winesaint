import RegionLayout from '@/components/RegionLayout';

export default function LaCardeusePage() {
  return (
    <RegionLayout
      title="La Cardeuse"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="la-cardeuse-vineyard-guide.md"
    />
  );
}
