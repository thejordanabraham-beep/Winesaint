import RegionLayout from '@/components/RegionLayout';

export default function ClosMarolePage() {
  return (
    <RegionLayout
      title="Clos Marole"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="clos-marole-guide.md"
    />
  );
}
