import RegionLayout from '@/components/RegionLayout';

export default function EnRemillyPage() {
  return (
    <RegionLayout
      title="En Remilly"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="en-remilly-guide.md"
    />
  );
}
