import RegionLayout from '@/components/RegionLayout';

export default function GippslandPage() {
  return (
    <RegionLayout
      title="Gippsland"
      level="region"
      parentRegion="australia"
      contentFile="gippsland-guide.md"
    />
  );
}
