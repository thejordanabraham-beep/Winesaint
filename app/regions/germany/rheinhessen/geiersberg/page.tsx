import RegionLayout from '@/components/RegionLayout';

export default function GeiersbergPage() {
  return (
    <RegionLayout
      title="Geiersberg"
      level="vineyard"
      parentRegion="germany/rheinhessen"
      classification="grosses-gewachs"
      contentFile="geiersberg-guide.md"
    />
  );
}
