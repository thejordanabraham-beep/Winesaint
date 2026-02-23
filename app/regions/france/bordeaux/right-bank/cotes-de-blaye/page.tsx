import RegionLayout from '@/components/RegionLayout';

export default function CotesDeBlayePage() {
  return (
    <RegionLayout
      title="Côtes de Blaye"
      level="sub-region"
      parentRegion="france/bordeaux/right-bank"
      contentFile="cotes-de-blaye-guide.md"
    />
  );
}
