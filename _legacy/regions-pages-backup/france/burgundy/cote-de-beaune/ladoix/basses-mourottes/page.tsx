import RegionLayout from '@/components/RegionLayout';

export default function BassesMourottesPage() {
  return (
    <RegionLayout
      title="Basses Mourottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="basses-mourottes-guide.md"
    />
  );
}
