import RegionLayout from '@/components/RegionLayout';

export default function SaeringPage() {
  return (
    <RegionLayout
      title="Saering"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="saering-guide.md"
    />
  );
}
