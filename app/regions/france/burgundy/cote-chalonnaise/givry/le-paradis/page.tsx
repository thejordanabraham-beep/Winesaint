import RegionLayout from '@/components/RegionLayout';

export default function LeParadisPage() {
  return (
    <RegionLayout
      title="Le Paradis"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="le-paradis-guide.md"
    />
  );
}
