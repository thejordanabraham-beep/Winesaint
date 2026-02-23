import RegionLayout from '@/components/RegionLayout';

export default function LaMatrossePage() {
  return (
    <RegionLayout
      title="La Matrosse"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="la-matrosse-guide.md"
    />
  );
}
