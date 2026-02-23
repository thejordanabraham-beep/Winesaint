import RegionLayout from '@/components/RegionLayout';

export default function SilberbergPage() {
  return (
    <RegionLayout
      title="Silberberg"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="silberberg-guide.md"
    />
  );
}
