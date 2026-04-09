import RegionLayout from '@/components/RegionLayout';

export default async function HermitagePage() {
  return (
    <RegionLayout
      title="Hermitage"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="hermitage-guide.md"
    />
  );
}
