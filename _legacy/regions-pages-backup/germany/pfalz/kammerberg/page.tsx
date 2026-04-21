import RegionLayout from '@/components/RegionLayout';

export default function KammerbergPage() {
  return (
    <RegionLayout
      title="Kammerberg"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kammerberg-guide.md"
    />
  );
}
