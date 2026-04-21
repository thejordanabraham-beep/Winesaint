import RegionLayout from '@/components/RegionLayout';

export default function GrandeCtePage() {
  return (
    <RegionLayout
      title="Grande Côte"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="grande-cote-guide.md"
    />
  );
}
