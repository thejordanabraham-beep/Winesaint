import RegionLayout from '@/components/RegionLayout';

export default function SteingrublerPage() {
  return (
    <RegionLayout
      title="Steingrubler"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="steingrubler-guide.md"
    />
  );
}
