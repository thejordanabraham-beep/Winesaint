import RegionLayout from '@/components/RegionLayout';

export default function LesBrusPage() {
  return (
    <RegionLayout
      title="Les Brus"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-brus-guide.md"
    />
  );
}
