import RegionLayout from '@/components/RegionLayout';

export default function ZotzenbergPage() {
  return (
    <RegionLayout
      title="Zotzenberg"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="zotzenberg-guide.md"
    />
  );
}
