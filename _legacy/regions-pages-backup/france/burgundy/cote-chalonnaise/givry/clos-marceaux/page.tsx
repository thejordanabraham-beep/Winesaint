import RegionLayout from '@/components/RegionLayout';

export default function ClosMarceauxPage() {
  return (
    <RegionLayout
      title="Clos Marceaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="clos-marceaux-guide.md"
    />
  );
}
