import RegionLayout from '@/components/RegionLayout';

export default async function ChiroublesPage() {
  return (
    <RegionLayout
      title="Chiroubles"
      level="sub-region"
      parentRegion="france/beaujolais"
      contentFile="chiroubles-guide.md"
    />
  );
}
