import RegionLayout from '@/components/RegionLayout';

export default async function CondrieuPage() {
  return (
    <RegionLayout
      title="Condrieu"
      level="sub-region"
      parentRegion="france/northern-rhone"
      contentFile="condrieu-guide.md"
    />
  );
}
