import RegionLayout from '@/components/RegionLayout';

export default function MnchbergPage() {
  return (
    <RegionLayout
      title="Mönchberg"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="monchberg-guide.md"
    />
  );
}
