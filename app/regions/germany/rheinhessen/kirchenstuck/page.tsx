import RegionLayout from '@/components/RegionLayout';

export default function KirchenstckPage() {
  return (
    <RegionLayout
      title="Kirchenstück"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="kirchenstuck-guide.md"
    />
  );
}
