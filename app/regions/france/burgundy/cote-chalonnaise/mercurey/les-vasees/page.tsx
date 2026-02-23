import RegionLayout from '@/components/RegionLayout';

export default function LesVasesPage() {
  return (
    <RegionLayout
      title="Les Vasées"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-vasees-guide.md"
    />
  );
}
