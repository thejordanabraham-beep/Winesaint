import RegionLayout from '@/components/RegionLayout';

export default function FurstentumPage() {
  return (
    <RegionLayout
      title="Furstentum"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="furstentum-guide.md"
    />
  );
}
