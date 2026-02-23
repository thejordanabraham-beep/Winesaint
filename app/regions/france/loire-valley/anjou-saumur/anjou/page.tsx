import RegionLayout from '@/components/RegionLayout';

export default function AnjouPage() {
  return (
    <RegionLayout
      title="Anjou"
      level="village"
      parentRegion="france/loire-valley/anjou-saumur"
      contentFile="anjou-guide.md"
    />
  );
}
