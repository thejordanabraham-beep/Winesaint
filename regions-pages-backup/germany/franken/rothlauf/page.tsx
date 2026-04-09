import RegionLayout from '@/components/RegionLayout';

export default function RothlaufPage() {
  return (
    <RegionLayout
      title="Rothlauf"
      level="vineyard"
      parentRegion="germany/franken"
      classification="grosses-gewachs"
      contentFile="rothlauf-guide.md"
    />
  );
}
