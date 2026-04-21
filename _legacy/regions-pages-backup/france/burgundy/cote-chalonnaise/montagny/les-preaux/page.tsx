import RegionLayout from '@/components/RegionLayout';

export default function LesPrauxPage() {
  return (
    <RegionLayout
      title="Les Préaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-preaux-guide.md"
    />
  );
}
