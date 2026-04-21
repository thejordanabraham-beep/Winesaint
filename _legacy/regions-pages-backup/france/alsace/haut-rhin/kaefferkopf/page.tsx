import RegionLayout from '@/components/RegionLayout';

export default function KaefferkopfPage() {
  return (
    <RegionLayout
      title="Kaefferkopf"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="kaefferkopf-guide.md"
    />
  );
}
