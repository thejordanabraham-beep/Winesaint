import RegionLayout from '@/components/RegionLayout';

export default function MolisePage() {
  return (
    <RegionLayout
      title="Molise"
      level="region"
      parentRegion="italy"
      contentFile="molise-guide.md"
    />
  );
}
