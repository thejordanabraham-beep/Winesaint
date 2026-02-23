import RegionLayout from '@/components/RegionLayout';

export default function LeVernoyPage() {
  return (
    <RegionLayout
      title="Le Vernoy"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="le-vernoy-guide.md"
    />
  );
}
