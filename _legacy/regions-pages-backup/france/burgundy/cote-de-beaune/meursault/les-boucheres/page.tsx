import RegionLayout from '@/components/RegionLayout';

export default function LesBoucheresPage() {
  return (
    <RegionLayout
      title="Les Boucheres"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/meursault"
      classification="premier-cru"
      contentFile="les-boucheres-vineyard-guide.md"
    />
  );
}
