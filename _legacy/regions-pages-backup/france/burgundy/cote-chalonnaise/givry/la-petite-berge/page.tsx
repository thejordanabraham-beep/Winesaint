import RegionLayout from '@/components/RegionLayout';

export default function LaPetiteBergePage() {
  return (
    <RegionLayout
      title="La Petite Berge"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="la-petite-berge-guide.md"
    />
  );
}
