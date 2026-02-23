import RegionLayout from '@/components/RegionLayout';

export default async function SaintJosephPage() {
  return (
    <RegionLayout
      title="Saint-Joseph"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="saint-joseph-guide.md"
    />
  );
}
