import RegionLayout from '@/components/RegionLayout';

export default function SaumagenPage() {
  return (
    <RegionLayout
      title="Saumagen"
      level="vineyard"
      parentRegion="germany/pfalz"
      classification="grosses-gewachs"
      contentFile="saumagen-guide.md"
    />
  );
}
