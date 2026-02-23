import RegionLayout from '@/components/RegionLayout';

export default function GaviPage() {
  return (
    <RegionLayout
      title="Gavi"
      level="sub-region"
      parentRegion="italy/piedmont"
      contentFile="gavi-guide.md"
    />
  );
}
