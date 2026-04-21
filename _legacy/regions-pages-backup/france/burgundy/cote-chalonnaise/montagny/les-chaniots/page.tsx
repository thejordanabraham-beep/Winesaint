import RegionLayout from '@/components/RegionLayout';

export default function LesChaniotsPage() {
  return (
    <RegionLayout
      title="Les Chaniots"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-chaniots-guide.md"
    />
  );
}
