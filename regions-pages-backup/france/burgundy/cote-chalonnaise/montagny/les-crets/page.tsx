import RegionLayout from '@/components/RegionLayout';

export default function LesCretsPage() {
  return (
    <RegionLayout
      title="Les Crets"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/montagny"
      classification="premier-cru"
      contentFile="les-crets-guide.md"
    />
  );
}
