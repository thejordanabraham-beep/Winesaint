import RegionLayout from '@/components/RegionLayout';

export default function SporenPage() {
  return (
    <RegionLayout
      title="Sporen"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="sporen-guide.md"
    />
  );
}
