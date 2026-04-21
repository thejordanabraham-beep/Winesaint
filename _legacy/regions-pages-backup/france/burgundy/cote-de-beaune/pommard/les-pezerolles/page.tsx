import RegionLayout from '@/components/RegionLayout';

export default function LesPzerollesPage() {
  return (
    <RegionLayout
      title="Les Pézerolles"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-pezerolles-guide.md"
    />
  );
}
