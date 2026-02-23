import RegionLayout from '@/components/RegionLayout';

export default function CombePage() {
  return (
    <RegionLayout
      title="Combe"
      level="vineyard"
      parentRegion="france/rhone/cornas"
      classification="climat"
      contentFile="combe-guide.md"
    />
  );
}
