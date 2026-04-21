import RegionLayout from '@/components/RegionLayout';

export default function LesChampsMartinPage() {
  return (
    <RegionLayout
      title="Les Champs Martin"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-champs-martin-guide.md"
    />
  );
}
