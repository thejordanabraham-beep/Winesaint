import RegionLayout from '@/components/RegionLayout';

export default function ReuillyPage() {
  return (
    <RegionLayout
      title="Reuilly"
      level="village"
      parentRegion="france/loire-valley/centre-loire"
      contentFile="reuilly-guide.md"
    />
  );
}
