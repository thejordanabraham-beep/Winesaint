import RegionLayout from '@/components/RegionLayout';

export default function RangenPage() {
  return (
    <RegionLayout
      title="Rangen"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="rangen-guide.md"
    />
  );
}
