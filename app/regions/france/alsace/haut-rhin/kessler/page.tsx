import RegionLayout from '@/components/RegionLayout';

export default function KesslerPage() {
  return (
    <RegionLayout
      title="Kessler"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="kessler-guide.md"
    />
  );
}
