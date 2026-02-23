import RegionLayout from '@/components/RegionLayout';

export default function AnnabergPage() {
  return (
    <RegionLayout
      title="Annaberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="annaberg-guide.md"
    />
  );
}
