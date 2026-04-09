import RegionLayout from '@/components/RegionLayout';

export default function LesRougereauxPage() {
  return (
    <RegionLayout
      title="Les Rougereaux"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-rougereaux-guide.md"
    />
  );
}
