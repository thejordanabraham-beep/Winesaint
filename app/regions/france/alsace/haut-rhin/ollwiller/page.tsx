import RegionLayout from '@/components/RegionLayout';

export default function OllwillerPage() {
  return (
    <RegionLayout
      title="Ollwiller"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="ollwiller-guide.md"
    />
  );
}
