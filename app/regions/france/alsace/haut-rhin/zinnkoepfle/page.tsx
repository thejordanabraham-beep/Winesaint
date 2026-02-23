import RegionLayout from '@/components/RegionLayout';

export default function ZinnkoepflPage() {
  return (
    <RegionLayout
      title="Zinnkoepflé"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="zinnkoepfle-guide.md"
    />
  );
}
