import RegionLayout from '@/components/RegionLayout';

export default function KloppbergPage() {
  return (
    <RegionLayout
      title="Kloppberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="kloppberg-guide.md"
    />
  );
}
