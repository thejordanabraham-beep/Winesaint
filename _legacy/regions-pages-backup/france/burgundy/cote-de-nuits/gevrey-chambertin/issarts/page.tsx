import RegionLayout from '@/components/RegionLayout';

export default function IssartsPage() {
  return (
    <RegionLayout
      title="Issarts"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="issarts-guide.md"
    />
  );
}
