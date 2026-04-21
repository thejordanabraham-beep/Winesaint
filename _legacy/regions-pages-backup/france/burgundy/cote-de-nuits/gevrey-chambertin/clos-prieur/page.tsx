import RegionLayout from '@/components/RegionLayout';

export default function ClosPrieurPage() {
  return (
    <RegionLayout
      title="Clos Prieur"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="clos-prieur-guide.md"
    />
  );
}
