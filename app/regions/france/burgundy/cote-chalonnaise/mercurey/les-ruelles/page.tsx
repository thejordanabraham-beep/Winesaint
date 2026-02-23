import RegionLayout from '@/components/RegionLayout';

export default function LesRuellesPage() {
  return (
    <RegionLayout
      title="Les Ruelles"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-ruelles-guide.md"
    />
  );
}
