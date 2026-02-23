import RegionLayout from '@/components/RegionLayout';

export default function BrandPage() {
  return (
    <RegionLayout
      title="Brand"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="brand-guide.md"
    />
  );
}
