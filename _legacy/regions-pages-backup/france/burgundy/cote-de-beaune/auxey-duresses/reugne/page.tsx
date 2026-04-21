import RegionLayout from '@/components/RegionLayout';

export default function ReugnePage() {
  return (
    <RegionLayout
      title="Reugne"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/auxey-duresses"
      classification="premier-cru"
      contentFile="reugne-guide.md"
    />
  );
}
