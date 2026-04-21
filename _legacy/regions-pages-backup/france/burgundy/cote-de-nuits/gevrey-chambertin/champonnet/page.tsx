import RegionLayout from '@/components/RegionLayout';

export default function ChamponnetPage() {
  return (
    <RegionLayout
      title="Champonnet"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="champonnet-guide.md"
    />
  );
}
