import RegionLayout from '@/components/RegionLayout';

export default function BurgenlandPage() {
  return (
    <RegionLayout
      title="Burgenland"
      level="region"
      parentRegion="austria"
      contentFile="burgenland-guide.md"
    />
  );
}
