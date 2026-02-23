import RegionLayout from '@/components/RegionLayout';

export default function ArboisPage() {
  return (
    <RegionLayout
      title="Arbois"
      level="sub-region"
      parentRegion="france/jura"
      contentFile="arbois-guide.md"
    />
  );
}
