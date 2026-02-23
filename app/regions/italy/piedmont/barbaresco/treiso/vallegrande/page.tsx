import RegionLayout from '@/components/RegionLayout';

export default function VallegrandePage() {
  return (
    <RegionLayout
      title="Vallegrande"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/treiso"
      classification="mga"
      contentFile="vallegrande-guide.md"
    />
  );
}
