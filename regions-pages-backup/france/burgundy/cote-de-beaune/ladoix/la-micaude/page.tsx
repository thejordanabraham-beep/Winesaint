import RegionLayout from '@/components/RegionLayout';

export default function LaMicaudePage() {
  return (
    <RegionLayout
      title="La Micaude"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/ladoix"
      classification="premier-cru"
      contentFile="la-micaude-guide.md"
    />
  );
}
