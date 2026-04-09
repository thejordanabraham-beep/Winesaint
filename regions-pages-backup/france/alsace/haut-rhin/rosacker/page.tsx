import RegionLayout from '@/components/RegionLayout';

export default function RosackerPage() {
  return (
    <RegionLayout
      title="Rosacker"
      level="vineyard"
      parentRegion="france/alsace/haut-rhin"
      classification="grand-cru"
      contentFile="rosacker-guide.md"
    />
  );
}
