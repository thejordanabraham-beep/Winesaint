import RegionLayout from '@/components/RegionLayout';

export default function EnlaRanchPage() {
  return (
    <RegionLayout
      title="En la Ranché"
      level="vineyard"
      parentRegion="france/burgundy/cote-de-beaune/saint-aubin"
      classification="premier-cru"
      contentFile="en-la-ranche-guide.md"
    />
  );
}
