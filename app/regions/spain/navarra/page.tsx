import RegionLayout from '@/components/RegionLayout';

export default function NavarraPage() {
  return (
    <RegionLayout
      title="Navarra"
      level="region"
      parentRegion="spain"
      contentFile="navarra-guide.md"
    />
  );
}
