import RegionLayout from '@/components/RegionLayout';

export default function KirchspielPage() {
  return (
    <RegionLayout
      title="Kirchspiel"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="kirchspiel-guide.md"
    />
  );
}
