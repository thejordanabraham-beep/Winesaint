import RegionLayout from '@/components/RegionLayout';

export default function OrangePage() {
  return (
    <RegionLayout
      title="Orange"
      level="region"
      parentRegion="australia"
      contentFile="orange-guide.md"
    />
  );
}
