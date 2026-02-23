import RegionLayout from '@/components/RegionLayout';

export default function PulvermcherPage() {
  return (
    <RegionLayout
      title="Pulvermächer"
      level="vineyard"
      parentRegion="germany/wurttemberg"
      classification="grosses-gewachs"
      contentFile="pulvermacher-guide.md"
    />
  );
}
