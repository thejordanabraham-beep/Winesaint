import RegionLayout from '@/components/RegionLayout';

export default function KirchbergPage() {
  return (
    <RegionLayout
      title="Kirchberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="kirchberg-guide.md"
    />
  );
}
