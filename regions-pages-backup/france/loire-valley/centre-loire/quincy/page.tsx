import RegionLayout from '@/components/RegionLayout';

export default function QuincyPage() {
  return (
    <RegionLayout
      title="Quincy"
      level="village"
      parentRegion="france/loire-valley/centre-loire"
      contentFile="quincy-guide.md"
    />
  );
}
