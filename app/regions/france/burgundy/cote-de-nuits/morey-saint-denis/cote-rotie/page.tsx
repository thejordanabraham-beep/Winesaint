import RegionLayout from '@/components/RegionLayout';

export default function CteRtiePage() {
  return (
    <RegionLayout
      title="Côte Rôtie"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/morey-saint-denis"
      classification="premier-cru"
      contentFile="cote-rotie-guide.md"
    />
  );
}
