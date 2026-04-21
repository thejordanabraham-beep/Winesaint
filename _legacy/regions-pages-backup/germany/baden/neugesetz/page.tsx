import RegionLayout from '@/components/RegionLayout';

export default function NeugesetzPage() {
  return (
    <RegionLayout
      title="Neugesetz"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="neugesetz-guide.md"
    />
  );
}
