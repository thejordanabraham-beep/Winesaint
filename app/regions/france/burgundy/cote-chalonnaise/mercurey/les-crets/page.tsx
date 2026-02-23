import RegionLayout from '@/components/RegionLayout';

export default function LesCrtsPage() {
  return (
    <RegionLayout
      title="Les Crêts"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-crets-guide.md"
    />
  );
}
