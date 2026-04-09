import RegionLayout from '@/components/RegionLayout';

export default function SpiegelbergPage() {
  return (
    <RegionLayout
      title="Spiegelberg"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="spiegelberg-guide.md"
    />
  );
}
