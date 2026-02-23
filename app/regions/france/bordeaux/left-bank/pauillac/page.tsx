import RegionLayout from '@/components/RegionLayout';

export default function PauillacPage() {
  return (
    <RegionLayout
      title="Pauillac"
      level="sub-region"
      parentRegion="france/bordeaux/left-bank"
      contentFile="pauillac-guide.md"
    />
  );
}
