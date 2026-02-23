import RegionLayout from '@/components/RegionLayout';

export default function AbruzzoPage() {
  return (
    <RegionLayout
      title="Abruzzo"
      level="region"
      parentRegion="italy"
      contentFile="abruzzo-guide.md"
    />
  );
}
