import RegionLayout from '@/components/RegionLayout';

export default function HofbergPage() {
  return (
    <RegionLayout
      title="Hofberg"
      level="vineyard"
      parentRegion="germany/mosel"
      classification="grosses-gewachs"
      contentFile="hofberg-guide.md"
    />
  );
}
