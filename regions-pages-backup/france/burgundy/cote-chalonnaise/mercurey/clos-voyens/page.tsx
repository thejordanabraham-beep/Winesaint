import RegionLayout from '@/components/RegionLayout';

export default function ClosVoyensPage() {
  return (
    <RegionLayout
      title="Clos Voyens"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="clos-voyens-guide.md"
    />
  );
}
