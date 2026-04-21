import RegionLayout from '@/components/RegionLayout';

export default function MittelburgenlandPage() {
  return (
    <RegionLayout
      title="Mittelburgenland"
      level="region"
      parentRegion="austria"
      contentFile="mittelburgenland-guide.md"
    />
  );
}
