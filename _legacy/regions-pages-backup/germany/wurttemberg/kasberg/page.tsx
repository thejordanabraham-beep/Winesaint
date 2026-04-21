import RegionLayout from '@/components/RegionLayout';

export default function KsbergPage() {
  return (
    <RegionLayout
      title="Käsberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="kasberg-guide.md"
    />
  );
}
