import RegionLayout from '@/components/RegionLayout';

export default function SaintEstephePage() {
  return (
    <RegionLayout
      title="Saint-Estèphe"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="saint-estephe-guide.md"
    />
  );
}
