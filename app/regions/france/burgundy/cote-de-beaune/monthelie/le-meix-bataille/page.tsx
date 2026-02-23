import RegionLayout from '@/components/RegionLayout';

export default function LeMeixBataillePage() {
  return (
    <RegionLayout
      title="Le Meix Bataille"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="le-meix-bataille-guide.md"
    />
  );
}
