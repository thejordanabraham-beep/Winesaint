import RegionLayout from '@/components/RegionLayout';

export default function GriffresPage() {
  return (
    <RegionLayout
      title="Griffères"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="grifferes-guide.md"
    />
  );
}
