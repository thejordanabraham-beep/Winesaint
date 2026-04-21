import RegionLayout from '@/components/RegionLayout';

export default async function VacqueyrasPage() {
  return (
    <RegionLayout
      title="Vacqueyras"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="vacqueyras-guide.md"
    />
  );
}
