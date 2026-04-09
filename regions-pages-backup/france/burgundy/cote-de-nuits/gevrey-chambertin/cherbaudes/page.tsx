import RegionLayout from '@/components/RegionLayout';

export default function CherbaudesPage() {
  return (
    <RegionLayout
      title="Cherbaudes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="cherbaudes-guide.md"
    />
  );
}
