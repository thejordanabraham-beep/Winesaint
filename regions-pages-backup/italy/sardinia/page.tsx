import RegionLayout from '@/components/RegionLayout';

export default function SardiniaPage() {
  return (
    <RegionLayout
      title="Sardinia"
      level="region"
      parentRegion="italy"
      contentFile="sardinia-guide.md"
    />
  );
}
