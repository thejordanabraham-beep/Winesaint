import RegionLayout from '@/components/RegionLayout';

export default function SteinklotzPage() {
  return (
    <RegionLayout
      title="Steinklotz"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="steinklotz-guide.md"
    />
  );
}
