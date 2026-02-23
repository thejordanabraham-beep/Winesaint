import RegionLayout from '@/components/RegionLayout';

export default function LanghePage() {
  return (
    <RegionLayout
      title="Langhe"
      level="sub-region"
      parentRegion="italy/piedmont"
      contentFile="langhe-guide.md"
    />
  );
}
