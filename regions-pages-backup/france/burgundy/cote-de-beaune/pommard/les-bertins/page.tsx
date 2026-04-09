import RegionLayout from '@/components/RegionLayout';

export default function LesBertinsPage() {
  return (
    <RegionLayout
      title="Les Bertins"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/pommard"
      classification="premier-cru"
      contentFile="les-bertins-guide.md"
    />
  );
}
