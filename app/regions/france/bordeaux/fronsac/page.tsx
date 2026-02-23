import RegionLayout from '@/components/RegionLayout';

export default function FronsacPage() {
  return (
    <RegionLayout
      title="Fronsac"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="fronsac-guide.md"
    />
  );
}
