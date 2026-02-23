import RegionLayout from '@/components/RegionLayout';

export default function WurttembergPage() {
  return (
    <RegionLayout
      title="Württemberg"
      level="region"
      parentRegion="germany"
      contentFile="wurttemberg-guide.md"
    />
  );
}
