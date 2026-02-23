import RegionLayout from '@/components/RegionLayout';

export default function LesDuressesPage() {
  return (
    <RegionLayout
      title="Les Duresses"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/monthelie"
      classification="premier-cru"
      contentFile="les-duresses-guide.md"
    />
  );
}
