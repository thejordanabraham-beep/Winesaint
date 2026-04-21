import RegionLayout from '@/components/RegionLayout';

export default function SchlossSaarsteinerPage() {
  return (
    <RegionLayout
      title="Schloss Saarsteiner"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="schloss-saarsteiner-guide.md"
    />
  );
}
