import RegionLayout from '@/components/RegionLayout';

export default function LesBrterinsPage() {
  return (
    <RegionLayout
      title="Les Bréterins"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="les-breterins-guide.md"
    />
  );
}
