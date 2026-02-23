import RegionLayout from '@/components/RegionLayout';

export default function EnErgotPage() {
  return (
    <RegionLayout
      title="En Ergot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="en-ergot-guide.md"
    />
  );
}
