import RegionLayout from '@/components/RegionLayout';

export default async function CotesDeProvencePage() {
  return (
    <RegionLayout
      title="Côtes de Provence"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="côtes-de-provence-guide.md"
    />
  );
}
