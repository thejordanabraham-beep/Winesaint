import RegionLayout from '@/components/RegionLayout';

export default function LesSaumontsPage() {
  return (
    <RegionLayout
      title="Les Saumonts"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-saumonts-guide.md"
    />
  );
}
