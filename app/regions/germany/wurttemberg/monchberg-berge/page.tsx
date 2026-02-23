import RegionLayout from '@/components/RegionLayout';

export default function MnchbergBergePage() {
  return (
    <RegionLayout
      title="Mönchberg Berge"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="monchberg-berge-guide.md"
    />
  );
}
