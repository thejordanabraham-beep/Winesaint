import RegionLayout from '@/components/RegionLayout';

export default function LeckerbergPage() {
  return (
    <RegionLayout
      title="Leckerberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="leckerberg-guide.md"
    />
  );
}
