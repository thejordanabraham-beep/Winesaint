import RegionLayout from '@/components/RegionLayout';

export default function TrotzenbergPage() {
  return (
    <RegionLayout
      title="Trotzenberg"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="trotzenberg-guide.md"
    />
  );
}
