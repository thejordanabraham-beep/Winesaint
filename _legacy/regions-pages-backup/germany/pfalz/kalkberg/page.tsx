import RegionLayout from '@/components/RegionLayout';

export default function KalkbergPage() {
  return (
    <RegionLayout
      title="Kalkberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kalkberg-guide.md"
    />
  );
}
