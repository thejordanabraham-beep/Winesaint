import RegionLayout from '@/components/RegionLayout';

export default function CretePage() {
  return (
    <RegionLayout
      title="Crete"
      level="region"
      parentRegion="greece"
      contentFile="crete-guide.md"
    />
  );
}
