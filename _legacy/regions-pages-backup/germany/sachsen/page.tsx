import RegionLayout from '@/components/RegionLayout';

export default function SachsenPage() {
  return (
    <RegionLayout
      title="Sachsen"
      level="region"
      parentRegion="germany"
      contentFile="sachsen-guide.md"
    />
  );
}
