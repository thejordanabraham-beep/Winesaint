import RegionLayout from '@/components/RegionLayout';

export default function FrankenPage() {
  return (
    <RegionLayout
      title="Franken"
      level="region"
      parentRegion="germany"
      contentFile="franken-guide.md"
    />
  );
}
