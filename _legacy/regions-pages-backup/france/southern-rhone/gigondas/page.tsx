import RegionLayout from '@/components/RegionLayout';

export default async function GigondasPage() {
  return (
    <RegionLayout
      title="Gigondas"
      level="sub-region"
      parentRegion="france/southern-rhone"
      contentFile="gigondas-guide.md"
    />
  );
}
