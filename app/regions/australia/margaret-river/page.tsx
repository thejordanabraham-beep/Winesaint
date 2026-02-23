import RegionLayout from '@/components/RegionLayout';

// Margaret River is a relatively homogeneous region - no sub-region sidebar needed
export default function MargaretRiverPage() {
  return (
    <RegionLayout
      title="Margaret River"
      level="region"
      parentRegion="australia"
      contentFile="margaret-river-guide.md"
    />
  );
}
