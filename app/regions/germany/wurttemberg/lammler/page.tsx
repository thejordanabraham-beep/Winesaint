import RegionLayout from '@/components/RegionLayout';

export default function LmmlerPage() {
  return (
    <RegionLayout
      title="Lämmler"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="lammler-guide.md"
    />
  );
}
