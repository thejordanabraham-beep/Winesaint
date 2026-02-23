import RegionLayout from '@/components/RegionLayout';

export default function SpiegelPage() {
  return (
    <RegionLayout
      title="Spiegel"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="spiegel-guide.md"
    />
  );
}
