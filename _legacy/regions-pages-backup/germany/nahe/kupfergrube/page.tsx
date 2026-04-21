import RegionLayout from '@/components/RegionLayout';

export default function KupfergrubePage() {
  return (
    <RegionLayout
      title="Kupfergrube"
      level="vineyard"
      parentRegion="germany/nahe"
      classification="grosses-gewachs"
      contentFile="kupfergrube-guide.md"
    />
  );
}
