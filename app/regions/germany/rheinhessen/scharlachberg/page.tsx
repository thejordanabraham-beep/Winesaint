import RegionLayout from '@/components/RegionLayout';

export default function ScharlachbergPage() {
  return (
    <RegionLayout
      title="Scharlachberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="scharlachberg-guide.md"
    />
  );
}
