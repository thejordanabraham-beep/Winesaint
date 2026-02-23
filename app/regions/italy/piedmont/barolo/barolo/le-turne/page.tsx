import RegionLayout from '@/components/RegionLayout';

export default function LeTurnePage() {
  return (
    <RegionLayout
      title="Le Turne"
      level="vineyard"
      parentRegion="italy/piedmont/barolo/barolo"
      classification="mga"
      contentFile="le-turne-guide.md"
    />
  );
}
