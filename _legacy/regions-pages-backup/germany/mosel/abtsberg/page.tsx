import RegionLayout from '@/components/RegionLayout';

export default function AbtsbergPage() {
  return (
    <RegionLayout
      title="Abtsberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="abtsberg-guide.md"
    />
  );
}
