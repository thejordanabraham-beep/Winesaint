import RegionLayout from '@/components/RegionLayout';

export default async function SaintAmourPage() {
  return (
    <RegionLayout
      title="Saint-Amour"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="saint-amour-guide.md"
    />
  );
}
