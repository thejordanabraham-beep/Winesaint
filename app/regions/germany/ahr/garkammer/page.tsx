import RegionLayout from '@/components/RegionLayout';

export default function GrkammerPage() {
  return (
    <RegionLayout
      title="Gärkammer"
      level="vineyard"
      parentRegion="germany/ahr"
      classification="grosses-gewachs"
      contentFile="garkammer-guide.md"
    />
  );
}
