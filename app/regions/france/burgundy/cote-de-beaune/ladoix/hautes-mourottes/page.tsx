import RegionLayout from '@/components/RegionLayout';

export default function HautesMourottesPage() {
  return (
    <RegionLayout
      title="Hautes Mourottes"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="hautes-mourottes-guide.md"
    />
  );
}
