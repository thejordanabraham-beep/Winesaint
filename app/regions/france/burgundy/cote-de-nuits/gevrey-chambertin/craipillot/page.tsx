import RegionLayout from '@/components/RegionLayout';

export default function CraipillotPage() {
  return (
    <RegionLayout
      title="Craipillot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="craipillot-guide.md"
    />
  );
}
