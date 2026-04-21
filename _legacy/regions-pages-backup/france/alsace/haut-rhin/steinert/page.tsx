import RegionLayout from '@/components/RegionLayout';

export default function SteinertPage() {
  return (
    <RegionLayout
      title="Steinert"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="steinert-guide.md"
    />
  );
}
