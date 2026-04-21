import RegionLayout from '@/components/RegionLayout';

export default function LaPalluePage() {
  return (
    <RegionLayout
      title="La Pallue"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="la-pallue-guide.md"
    />
  );
}
