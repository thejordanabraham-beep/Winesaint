import RegionLayout from '@/components/RegionLayout';

export default function SanMiguelDistrictPage() {
  return (
    <RegionLayout
      title="San Miguel District"
      level="village"
      parentRegion="united-states/california/paso-robles"
      contentFile="san-miguel-district-guide.md"
    />
  );
}
