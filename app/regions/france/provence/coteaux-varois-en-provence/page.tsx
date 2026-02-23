import RegionLayout from '@/components/RegionLayout';

export default async function CoteauxVaroisEnProvencePage() {
  return (
    <RegionLayout
      title="Coteaux Varois en Provence"
      level="sub-region"
      parentRegion="france/provence"
      contentFile="coteaux-varois-en-provence-guide.md"
    />
  );
}
