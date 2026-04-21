import RegionLayout from '@/components/RegionLayout';

export default function CalabriaPage() {
  return (
    <RegionLayout
      title="Calabria"
      level="region"
      parentRegion="italy"
      contentFile="calabria-guide.md"
    />
  );
}
