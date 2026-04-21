import RegionLayout from '@/components/RegionLayout';

export default function LisboaPage() {
  return (
    <RegionLayout
      title="Lisboa"
      level="region"
      parentRegion="portugal"
      contentFile="lisboa-guide.md"
    />
  );
}
