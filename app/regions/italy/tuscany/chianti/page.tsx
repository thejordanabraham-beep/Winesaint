import RegionLayout from '@/components/RegionLayout';

export default function ChiantiPage() {
  return (
    <RegionLayout
      title="Chianti"
      level="sub-region"
      parentRegion="italy/tuscany"
      contentFile="chianti-guide.md"
    />
  );
}
