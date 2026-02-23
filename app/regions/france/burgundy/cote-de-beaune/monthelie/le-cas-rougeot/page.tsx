import RegionLayout from '@/components/RegionLayout';

export default function LeCasRougeotPage() {
  return (
    <RegionLayout
      title="Le Cas Rougeot"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="le-cas-rougeot-guide.md"
    />
  );
}
