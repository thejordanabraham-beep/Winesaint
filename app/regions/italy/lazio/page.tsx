import RegionLayout from '@/components/RegionLayout';

export default function LazioPage() {
  return (
    <RegionLayout
      title="Lazio"
      level="region"
      parentRegion="italy"
      contentFile="lazio-guide.md"
    />
  );
}
