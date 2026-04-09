import RegionLayout from '@/components/RegionLayout';

export default async function LesBauxDeProvencePage() {
  return (
    <RegionLayout
      title="Les Baux-de-Provence"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="les-baux-de-provence-guide.md"
    />
  );
}
