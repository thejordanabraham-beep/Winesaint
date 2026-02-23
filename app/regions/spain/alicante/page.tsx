import RegionLayout from '@/components/RegionLayout';

export default function AlicantePage() {
  return (
    <RegionLayout
      title="Alicante"
      level="region"
      parentRegion="spain"
      contentFile="alicante-guide.md"
    />
  );
}
