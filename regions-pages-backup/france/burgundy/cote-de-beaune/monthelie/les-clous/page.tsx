import RegionLayout from '@/components/RegionLayout';

export default function LesClousPage() {
  return (
    <RegionLayout
      title="Les Clous"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="les-clous-guide.md"
    />
  );
}
