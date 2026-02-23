import RegionLayout from '@/components/RegionLayout';

export default function HochackerPage() {
  return (
    <RegionLayout
      title="Hochacker"
      level="vineyard"
      parentRegion="austria/wagram"
      contentFile="hochacker-guide.md"
    />
  );
}
