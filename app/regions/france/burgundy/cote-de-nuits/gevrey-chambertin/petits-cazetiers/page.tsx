import RegionLayout from '@/components/RegionLayout';

export default function PetitsCazetiersPage() {
  return (
    <RegionLayout
      title="Petits Cazetiers"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/gevrey-chambertin"
      classification="premier-cru"
      contentFile="petits-cazetiers-guide.md"
    />
  );
}
