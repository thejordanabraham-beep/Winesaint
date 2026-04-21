import RegionLayout from '@/components/RegionLayout';

export default function TrifoleraPage() {
  return (
    <RegionLayout
      title="Trifolera"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/barbaresco"
      classification="mga"
      contentFile="trifolera-guide.md"
    />
  );
}
