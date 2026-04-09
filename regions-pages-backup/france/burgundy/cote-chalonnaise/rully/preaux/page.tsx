import RegionLayout from '@/components/RegionLayout';

export default function PrauxPage() {
  return (
    <RegionLayout
      title="Préaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/rully"
      classification="premier-cru"
      contentFile="preaux-guide.md"
    />
  );
}
