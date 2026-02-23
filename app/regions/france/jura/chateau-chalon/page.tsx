import RegionLayout from '@/components/RegionLayout';

export default function ChateauChalonPage() {
  return (
    <RegionLayout
      title="Château-Chalon"
      level="sub-region"
      parentRegion="france/jura"
      contentFile="chateau-chalon-guide.md"
    />
  );
}
