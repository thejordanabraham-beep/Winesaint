import RegionLayout from '@/components/RegionLayout';

export default function ReynardPage() {
  return (
    <RegionLayout
      title="Reynard"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="reynard-guide.md"
    />
  );
}
