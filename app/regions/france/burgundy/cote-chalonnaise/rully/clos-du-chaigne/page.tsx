import RegionLayout from '@/components/RegionLayout';

export default function ClosduChaignePage() {
  return (
    <RegionLayout
      title="Clos du Chaigne"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="clos-du-chaigne-guide.md"
    />
  );
}
