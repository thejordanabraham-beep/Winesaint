import RegionLayout from '@/components/RegionLayout';

export default function BergePage() {
  return (
    <RegionLayout
      title="Berge"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="berge-guide.md"
    />
  );
}
