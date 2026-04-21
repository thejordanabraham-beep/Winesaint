import RegionLayout from '@/components/RegionLayout';

export default function ManzolaPage() {
  return (
    <RegionLayout
      title="Manzola"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/neive"
      classification="mga"
      contentFile="manzola-guide.md"
    />
  );
}
