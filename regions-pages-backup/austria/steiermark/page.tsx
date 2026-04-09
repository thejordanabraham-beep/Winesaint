import RegionLayout from '@/components/RegionLayout';

export default function SteiermarkPage() {
  return (
    <RegionLayout
      title="Steiermark"
      level="region"
      parentRegion="austria"
      contentFile="steiermark-guide.md"
    />
  );
}
