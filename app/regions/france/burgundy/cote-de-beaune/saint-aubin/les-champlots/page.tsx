import RegionLayout from '@/components/RegionLayout';

export default function LesChamplotsPage() {
  return (
    <RegionLayout
      title="Les Champlots"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="les-champlots-guide.md"
    />
  );
}
