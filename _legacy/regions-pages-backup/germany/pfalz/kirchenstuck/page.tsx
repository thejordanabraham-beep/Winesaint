import RegionLayout from '@/components/RegionLayout';

export default function KirchenstckPage() {
  return (
    <RegionLayout
      title="Kirchenstück"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="kirchenstuck-guide.md"
    />
  );
}
