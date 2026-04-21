import RegionLayout from '@/components/RegionLayout';

export default function LaGroulePage() {
  return (
    <RegionLayout
      title="La Groule"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="la-groule-guide.md"
    />
  );
}
