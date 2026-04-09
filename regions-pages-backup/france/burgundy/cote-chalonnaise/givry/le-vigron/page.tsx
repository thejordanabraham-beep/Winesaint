import RegionLayout from '@/components/RegionLayout';

export default function LeVigronPage() {
  return (
    <RegionLayout
      title="Le Vigron"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/givry"
      classification="premier-cru"
      contentFile="le-vigron-guide.md"
    />
  );
}
