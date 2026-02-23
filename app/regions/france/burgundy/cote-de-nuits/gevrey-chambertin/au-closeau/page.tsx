import RegionLayout from '@/components/RegionLayout';

export default function AuCloseauPage() {
  return (
    <RegionLayout
      title="Au Closeau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="au-closeau-guide.md"
    />
  );
}
