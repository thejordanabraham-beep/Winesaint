import RegionLayout from '@/components/RegionLayout';

export default function LeChteauGaillardPage() {
  return (
    <RegionLayout
      title="Le Château Gaillard"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="le-chateau-gaillard-guide.md"
    />
  );
}
