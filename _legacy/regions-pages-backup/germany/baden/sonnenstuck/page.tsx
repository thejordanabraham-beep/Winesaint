import RegionLayout from '@/components/RegionLayout';

export default function SonnenstckPage() {
  return (
    <RegionLayout
      title="Sonnenstück"
      level="vineyard"
      parentRegion="germany/baden"
      classification="grosses-gewachs"
      contentFile="sonnenstuck-guide.md"
    />
  );
}
