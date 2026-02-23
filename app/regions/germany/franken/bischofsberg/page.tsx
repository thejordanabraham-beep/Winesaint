import RegionLayout from '@/components/RegionLayout';

export default function BischofsbergPage() {
  return (
    <RegionLayout
      title="Bischofsberg"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="bischofsberg-guide.md"
    />
  );
}
