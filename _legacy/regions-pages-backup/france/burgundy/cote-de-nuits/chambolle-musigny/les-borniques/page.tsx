import RegionLayout from '@/components/RegionLayout';

export default function LesBorniquesPage() {
  return (
    <RegionLayout
      title="Les Borniques"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-nuits/chambolle-musigny"
      classification="premier-cru"
      contentFile="les-borniques-guide.md"
    />
  );
}
