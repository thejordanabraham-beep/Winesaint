import RegionLayout from '@/components/RegionLayout';

export default function KranzbergPage() {
  return (
    <RegionLayout
      title="Kranzberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="kranzberg-guide.md"
    />
  );
}
