import RegionLayout from '@/components/RegionLayout';

export default function CarsPage() {
  return (
    <RegionLayout
      title="Cars"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/barbaresco"
      classification="mga"
      contentFile="cars-guide.md"
    />
  );
}
