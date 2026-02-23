import RegionLayout from '@/components/RegionLayout';

export default function PreussenPage() {
  return (
    <RegionLayout
      title="Preussen"
      level="vineyard"
      parentRegion="austria/wien"
      contentFile="preussen-guide.md"
    />
  );
}
