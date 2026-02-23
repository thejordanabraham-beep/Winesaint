import RegionLayout from '@/components/RegionLayout';

export default function LaCroixRameauPage() {
  return (
    <RegionLayout
      title="La Croix Rameau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/vosne-romanee"
      classification="premier-cru"
      contentFile="la-croix-rameau-guide.md"
    />
  );
}
