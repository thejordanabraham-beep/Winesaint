import RegionLayout from '@/components/RegionLayout';

export default function DoosbergPage() {
  return (
    <RegionLayout
      title="Doosberg"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="doosberg-guide.md"
    />
  );
}
