import RegionLayout from '@/components/RegionLayout';

export default function LeCurtilPage() {
  return (
    <RegionLayout
      title="Le Curtil"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="le-curtil-guide.md"
    />
  );
}
