import RegionLayout from '@/components/RegionLayout';

export default function KammerPage() {
  return (
    <RegionLayout
      title="Kammer"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="kammer-guide.md"
    />
  );
}
