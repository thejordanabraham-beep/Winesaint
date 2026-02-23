import RegionLayout from '@/components/RegionLayout';

export default async function SermiersPage() {
  return (
    <RegionLayout
      title="Sermiers"
      level="village"
      parentRegion="france/champagne/montagne-de-reims"
      contentFile="sermiers-guide.md"
    />
  );
}
