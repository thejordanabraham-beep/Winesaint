import RegionLayout from '@/components/RegionLayout';

export default function LePetitPrtanPage() {
  return (
    <RegionLayout
      title="Le Petit Prétan"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="le-petit-pretan-guide.md"
    />
  );
}
