import RegionLayout from '@/components/RegionLayout';

export default function MnchbergPage() {
  return (
    <RegionLayout
      title="Mönchberg"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="monchberg-guide.md"
    />
  );
}
