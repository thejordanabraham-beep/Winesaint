import RegionLayout from '@/components/RegionLayout';

export default function HatschbourgPage() {
  return (
    <RegionLayout
      title="Hatschbourg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="hatschbourg-guide.md"
    />
  );
}
