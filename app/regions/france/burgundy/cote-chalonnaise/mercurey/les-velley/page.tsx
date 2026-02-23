import RegionLayout from '@/components/RegionLayout';

export default function LesVelleyPage() {
  return (
    <RegionLayout
      title="Les Velley"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-velley-guide.md"
    />
  );
}
