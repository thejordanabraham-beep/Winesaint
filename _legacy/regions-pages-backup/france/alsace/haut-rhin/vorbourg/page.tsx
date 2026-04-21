import RegionLayout from '@/components/RegionLayout';

export default function VorbourgPage() {
  return (
    <RegionLayout
      title="Vorbourg"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="vorbourg-guide.md"
    />
  );
}
