import RegionLayout from '@/components/RegionLayout';

export default function RosenthalPage() {
  return (
    <RegionLayout
      title="Rosenthal"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="rosenthal-guide.md"
    />
  );
}
