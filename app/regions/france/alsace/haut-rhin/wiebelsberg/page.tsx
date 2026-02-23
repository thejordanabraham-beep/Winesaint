import RegionLayout from '@/components/RegionLayout';

export default function WiebelsbergPage() {
  return (
    <RegionLayout
      title="Wiebelsberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="wiebelsberg-guide.md"
    />
  );
}
