import RegionLayout from '@/components/RegionLayout';

export default function LeCorbeauPage() {
  return (
    <RegionLayout
      title="Le Corbeau"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="le-corbeau-guide.md"
    />
  );
}
