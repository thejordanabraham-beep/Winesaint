import RegionLayout from '@/components/RegionLayout';

export default function FronsacPage() {
  return (
    <RegionLayout
      title="Fronsac"
      level="sub-region"
      parentRegion="france/bordeaux/right-bank"
      contentFile="fronsac-guide.md"
    />
  );
}
