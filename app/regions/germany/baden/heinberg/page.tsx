import RegionLayout from '@/components/RegionLayout';

export default function HeinbergPage() {
  return (
    <RegionLayout
      title="Heinberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="heinberg-guide.md"
    />
  );
}
