import RegionLayout from '@/components/RegionLayout';

export default function BruderbergPage() {
  return (
    <RegionLayout
      title="Bruderberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="bruderberg-guide.md"
    />
  );
}
