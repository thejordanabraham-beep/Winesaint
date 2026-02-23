import RegionLayout from '@/components/RegionLayout';

export default async function SaintPerayPage() {
  return (
    <RegionLayout
      title="Saint-Péray"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="saint-péray-guide.md"
    />
  );
}
