import RegionLayout from '@/components/RegionLayout';

export default function NahePage() {
  return (
    <RegionLayout
      title="Nahe"
      level="region"
      parentRegion="germany"
      contentFile="nahe-guide.md"
    />
  );
}
