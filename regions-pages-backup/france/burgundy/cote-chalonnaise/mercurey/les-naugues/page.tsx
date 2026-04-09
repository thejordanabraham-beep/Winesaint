import RegionLayout from '@/components/RegionLayout';

export default function LesNauguesPage() {
  return (
    <RegionLayout
      title="Les Naugues"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-naugues-guide.md"
    />
  );
}
