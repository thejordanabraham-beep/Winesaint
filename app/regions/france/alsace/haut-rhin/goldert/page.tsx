import RegionLayout from '@/components/RegionLayout';

export default function GoldertPage() {
  return (
    <RegionLayout
      title="Goldert"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="goldert-guide.md"
    />
  );
}
