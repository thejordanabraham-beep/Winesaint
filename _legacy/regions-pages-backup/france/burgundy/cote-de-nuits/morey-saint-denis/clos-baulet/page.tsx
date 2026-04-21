import RegionLayout from '@/components/RegionLayout';

export default function ClosBauletPage() {
  return (
    <RegionLayout
      title="Clos Baulet"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="clos-baulet-guide.md"
    />
  );
}
