import RegionLayout from '@/components/RegionLayout';

export default function PatouPage() {
  return (
    <RegionLayout
      title="Patou"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="patou-guide.md"
    />
  );
}
