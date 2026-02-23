import RegionLayout from '@/components/RegionLayout';

export default function FlorimontPage() {
  return (
    <RegionLayout
      title="Florimont"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="florimont-guide.md"
    />
  );
}
