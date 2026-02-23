import RegionLayout from '@/components/RegionLayout';

export default function EnMontceauPage() {
  return (
    <RegionLayout
      title="En Montceau"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="en-montceau-guide.md"
    />
  );
}
