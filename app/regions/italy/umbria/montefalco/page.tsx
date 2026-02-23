import RegionLayout from '@/components/RegionLayout';

export default function MontefalcoPage() {
  return (
    <RegionLayout
      title="Montefalco"
      level="sub-region"
      parentRegion="italy/umbria"
      contentFile="montefalco-guide.md"
    />
  );
}
