import RegionLayout from '@/components/RegionLayout';

export default function LaPucellePage() {
  return (
    <RegionLayout
      title="La Pucelle"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="la-pucelle-guide.md"
    />
  );
}
