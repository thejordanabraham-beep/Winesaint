import RegionLayout from '@/components/RegionLayout';

export default function BurgwegPage() {
  return (
    <RegionLayout
      title="Burgweg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="burgweg-guide.md"
    />
  );
}
