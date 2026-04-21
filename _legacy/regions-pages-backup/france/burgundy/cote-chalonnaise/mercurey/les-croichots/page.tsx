import RegionLayout from '@/components/RegionLayout';

export default function LesCroichotsPage() {
  return (
    <RegionLayout
      title="Les Croichots"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-croichots-guide.md"
    />
  );
}
