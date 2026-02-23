import RegionLayout from '@/components/RegionLayout';

export default function LaCtePage() {
  return (
    <RegionLayout
      title="La Côte"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="la-cote-guide.md"
    />
  );
}
