import RegionLayout from '@/components/RegionLayout';

export default function LesPuilletsPage() {
  return (
    <RegionLayout
      title="Les Puillets"
      level="vineyard"
      parentRegion="france/burgundy/cote-chalonnaise/mercurey"
      classification="premier-cru"
      contentFile="les-puillets-guide.md"
    />
  );
}
