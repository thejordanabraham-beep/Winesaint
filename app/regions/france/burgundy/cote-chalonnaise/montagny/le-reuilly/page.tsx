import RegionLayout from '@/components/RegionLayout';

export default function LeReuillyPage() {
  return (
    <RegionLayout
      title="Le Reuilly"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="le-reuilly-guide.md"
    />
  );
}
