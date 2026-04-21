import RegionLayout from '@/components/RegionLayout';

export default function CatamarcaPage() {
  return (
    <RegionLayout
      title="Catamarca"
      level="region"
      parentRegion="argentina"
      contentFile="catamarca-guide.md"
    />
  );
}
