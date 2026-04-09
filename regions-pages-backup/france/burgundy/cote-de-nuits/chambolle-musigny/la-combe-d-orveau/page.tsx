import RegionLayout from '@/components/RegionLayout';

export default function LaCombedOrveauPage() {
  return (
    <RegionLayout
      title="La Combe d'Orveau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="la-combe-d-orveau-guide.md"
    />
  );
}
