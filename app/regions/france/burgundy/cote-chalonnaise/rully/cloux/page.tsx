import RegionLayout from '@/components/RegionLayout';

export default function ClouxPage() {
  return (
    <RegionLayout
      title="Cloux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="cloux-guide.md"
    />
  );
}
