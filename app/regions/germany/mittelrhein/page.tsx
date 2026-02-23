import RegionLayout from '@/components/RegionLayout';

export default function MittelrheinPage() {
  return (
    <RegionLayout
      title="Mittelrhein"
      level="region"
      parentRegion="germany"
      contentFile="mittelrhein-guide.md"
    />
  );
}
