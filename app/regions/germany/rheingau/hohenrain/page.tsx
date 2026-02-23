import RegionLayout from '@/components/RegionLayout';

export default function HohenrainPage() {
  return (
    <RegionLayout
      title="Hohenrain"
      level="vineyard"
      parentRegion="germany/rheingau"
      classification="grosses-gewachs"
      contentFile="hohenrain-guide.md"
    />
  );
}
