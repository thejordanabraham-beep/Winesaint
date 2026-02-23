import RegionLayout from '@/components/RegionLayout';

export default function AlgarvePage() {
  return (
    <RegionLayout
      title="Algarve"
      level="region"
      parentRegion="portugal"
      contentFile="algarve-guide.md"
    />
  );
}
