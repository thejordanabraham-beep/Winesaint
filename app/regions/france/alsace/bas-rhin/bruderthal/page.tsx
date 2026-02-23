import RegionLayout from '@/components/RegionLayout';

export default function BruderthalPage() {
  return (
    <RegionLayout
      title="Bruderthal"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="bruderthal-guide.md"
    />
  );
}
