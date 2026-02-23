import RegionLayout from '@/components/RegionLayout';

export default function ClosSaintJeanPage() {
  return (
    <RegionLayout
      title="Clos Saint-Jean"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/chassagne-montrachet"
      classification="premier-cru"
      contentFile="clos-saint-jean-guide.md"
    />
  );
}
