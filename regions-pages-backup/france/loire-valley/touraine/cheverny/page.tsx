import RegionLayout from '@/components/RegionLayout';

export default function ChevernyPage() {
  return (
    <RegionLayout
      title="Cheverny"
      level="village"
      parentRegion="france/loire-valley/touraine"
      contentFile="cheverny-guide.md"
    />
  );
}
