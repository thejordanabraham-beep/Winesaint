import RegionLayout from '@/components/RegionLayout';

export default function HonigbergPage() {
  return (
    <RegionLayout
      title="Honigberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="honigberg-guide.md"
    />
  );
}
