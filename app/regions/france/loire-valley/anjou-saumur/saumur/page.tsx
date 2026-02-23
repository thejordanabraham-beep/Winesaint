import RegionLayout from '@/components/RegionLayout';

export default function SaumurPage() {
  return (
    <RegionLayout
      title="Saumur"
      level="village"
      parentRegion="france/loire-valley/anjou-saumur"
      contentFile="saumur-guide.md"
    />
  );
}
