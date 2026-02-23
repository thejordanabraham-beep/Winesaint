import RegionLayout from '@/components/RegionLayout';

export default function SanJuanPage() {
  return (
    <RegionLayout
      title="San Juan"
      level="region"
      parentRegion="argentina"
      contentFile="san-juan-guide.md"
    />
  );
}
