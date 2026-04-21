import RegionLayout from '@/components/RegionLayout';

export default function LaCorvePage() {
  return (
    <RegionLayout
      title="La Corvée"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="la-corvee-guide.md"
    />
  );
}
