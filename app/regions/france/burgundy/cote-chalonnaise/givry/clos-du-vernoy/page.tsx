import RegionLayout from '@/components/RegionLayout';

export default function ClosduVernoyPage() {
  return (
    <RegionLayout
      title="Clos du Vernoy"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="clos-du-vernoy-guide.md"
    />
  );
}
