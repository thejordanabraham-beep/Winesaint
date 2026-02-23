import RegionLayout from '@/components/RegionLayout';

export default function LesSaveauxPage() {
  return (
    <RegionLayout
      title="Les Saveaux"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="les-saveaux-guide.md"
    />
  );
}
