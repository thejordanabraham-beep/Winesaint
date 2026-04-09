import RegionLayout from '@/components/RegionLayout';

export default function LaGrandeBornePage() {
  return (
    <RegionLayout
      title="La Grande Borne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="la-grande-borne-guide.md"
    />
  );
}
