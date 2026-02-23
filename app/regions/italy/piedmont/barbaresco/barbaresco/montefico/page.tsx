import RegionLayout from '@/components/RegionLayout';

export default function MonteficoPage() {
  return (
    <RegionLayout
      title="Montefico"
      level="vineyard"
      parentRegion="italy/piedmont/barbaresco/barbaresco"
      classification="mga"
      contentFile="montefico-guide.md"
    />
  );
}
