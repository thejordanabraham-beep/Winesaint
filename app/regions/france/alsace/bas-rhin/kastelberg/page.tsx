import RegionLayout from '@/components/RegionLayout';

export default function KastelbergPage() {
  return (
    <RegionLayout
      title="Kastelberg"
      level="vineyard"
      parentRegion="france/alsace/bas-rhin"
      classification="grand-cru"
      contentFile="kastelberg-guide.md"
    />
  );
}
