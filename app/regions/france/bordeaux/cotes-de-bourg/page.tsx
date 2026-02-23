import RegionLayout from '@/components/RegionLayout';

export default function CotesDeBourgPage() {
  return (
    <RegionLayout
      title="Côtes de Bourg"
      level="sub-region"
      parentRegion="france/bordeaux"
      contentFile="cotes-de-bourg-guide.md"
    />
  );
}
