import RegionLayout from '@/components/RegionLayout';

export default function BourgueilPage() {
  return (
    <RegionLayout
      title="Bourgueil"
      level="village"
      parentRegion="france/loire-valley/touraine"
      contentFile="bourgueil-guide.md"
    />
  );
}
