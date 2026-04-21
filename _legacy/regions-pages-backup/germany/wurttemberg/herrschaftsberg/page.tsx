import RegionLayout from '@/components/RegionLayout';

export default function HerrschaftsbergPage() {
  return (
    <RegionLayout
      title="Herrschaftsberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="herrschaftsberg-guide.md"
    />
  );
}
