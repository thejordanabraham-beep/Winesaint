import RegionLayout from '@/components/RegionLayout';

export default function LesCraysPage() {
  return (
    <RegionLayout
      title="Les Crays"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="les-crays-guide.md"
    />
  );
}
