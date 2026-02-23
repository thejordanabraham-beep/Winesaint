import RegionLayout from '@/components/RegionLayout';

export default function KanzlerbergPage() {
  return (
    <RegionLayout
      title="Kanzlerberg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="kanzlerberg-guide.md"
    />
  );
}
